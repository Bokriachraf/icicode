import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Axios from 'axios';
import Paiement from '../models/paiementModel.js';
import Abonnement from '../models/abonnementModel.js';
import Plan from '../models/planModel.js';
import { isAuth, isAdmin } from '../utils.js';

const paiementRouter = express.Router();

const FLOUCI_URL = 'https://developers.flouci.com/api';

// ── POST /api/paiements/flouci/init — initier paiement Flouci ────────────────
paiementRouter.post('/flouci/init', isAuth, expressAsyncHandler(async (req, res) => {
  const tokenOk = process.env.FLOUCI_APP_TOKEN && !process.env.FLOUCI_APP_TOKEN.startsWith('REMPLACE_PAR');
  const secretOk = process.env.FLOUCI_APP_SECRET && !process.env.FLOUCI_APP_SECRET.startsWith('REMPLACE_PAR');
  if (!tokenOk || !secretOk) {
    return res.status(503).json({
      message: 'Le paiement en ligne Flouci n\'est pas encore configuré. Contactez l\'équipe Codalog pour un paiement manuel (espèces / virement).',
      code: 'FLOUCI_NOT_CONFIGURED',
    });
  }

  const { planId } = req.body;

  const plan = await Plan.findById(planId);
  if (!plan) return res.status(404).json({ message: 'Plan introuvable' });

  const montant = plan.prix;
  const montantMillimes = montant * 1000;

  const response = await Axios.post(`${FLOUCI_URL}/generate_payment`, {
    app_token:    process.env.FLOUCI_APP_TOKEN,
    app_secret:   process.env.FLOUCI_APP_SECRET,
    amount:       montantMillimes,
    accept_card:  true,
    session_timeout_secs: 1200,
    success_link: `${process.env.CODALOG_FRONTEND_URL}/abonnement/succes`,
    fail_link:    `${process.env.CODALOG_FRONTEND_URL}/abonnement/echec`,
    developer_tracking_id: `${req.user._id}-${planId}-${Date.now()}`,
  });

  const { payment_id, link } = response.data.result || response.data;

  // Créer abonnement suspendu
  const dateDebut = new Date();
  const dateEcheance = new Date();
  dateEcheance.setMonth(dateEcheance.getMonth() + plan.dureeEngagement);

  const abonnement = await Abonnement.create({
    eleveId: req.user._id,
    planId,
    dateDebut,
    dateEcheance,
    statut: 'suspendu',
    methodePaiement: 'flouci',
  });

  // Créer paiement en attente
  await Paiement.create({
    abonnementId: abonnement._id,
    eleveId: req.user._id,
    montant,
    statut: 'en_attente',
    methode: 'flouci',
    flouciPaymentId: payment_id,
    periode: { debut: dateDebut, fin: dateEcheance },
  });

  res.json({ payment_id, link });
}));

// ── GET /api/paiements/flouci/verify — vérifier après retour Flouci ──────────
paiementRouter.get('/flouci/verify', isAuth, expressAsyncHandler(async (req, res) => {
  const { payment_id } = req.query;

  const response = await Axios.get(`${FLOUCI_URL}/verify_payment/${payment_id}`, {
    headers: {
      apppublic:  process.env.FLOUCI_APP_TOKEN,
      appsecret:  process.env.FLOUCI_APP_SECRET,
    },
  });

  const status = response.data?.result?.status;
  const paiement = await Paiement.findOne({ flouciPaymentId: payment_id });
  if (!paiement) return res.status(404).json({ message: 'Paiement introuvable' });

  if (status === 'SUCCESS') {
    paiement.statut = 'payé';
    await paiement.save();
    await Abonnement.findByIdAndUpdate(paiement.abonnementId, { statut: 'actif' });
    return res.json({ statut: 'payé', abonnementId: paiement.abonnementId });
  }

  paiement.statut = 'échoué';
  await paiement.save();
  res.json({ statut: 'échoué' });
}));

// ── POST /api/paiements/virement/demander — l'élève déclare vouloir payer par virement/RIB ──
paiementRouter.post('/virement/demander', isAuth, expressAsyncHandler(async (req, res) => {
  const { planId, reference } = req.body;

  const plan = await Plan.findById(planId);
  if (!plan) return res.status(404).json({ message: 'Plan introuvable' });

  // Réutilise une demande déjà "suspendu" pour ce plan plutôt que d'en recréer une
  let abonnement = await Abonnement.findOne({
    eleveId: req.user._id,
    planId,
    statut: 'suspendu',
  });

  if (!abonnement) {
    const dateDebut = new Date();
    const dateEcheance = new Date();
    dateEcheance.setMonth(dateEcheance.getMonth() + plan.dureeEngagement);

    abonnement = await Abonnement.create({
      eleveId: req.user._id,
      planId,
      dateDebut,
      dateEcheance,
      statut: 'suspendu',
      methodePaiement: 'virement',
    });
  }

  const paiement = await Paiement.create({
    abonnementId: abonnement._id,
    eleveId: req.user._id,
    montant: plan.prix,
    statut: 'en_attente',
    methode: 'virement',
    periode: { debut: abonnement.dateDebut, fin: abonnement.dateEcheance },
    note: reference ? `Référence communiquée par l'élève : ${reference}` : null,
  });

  res.status(201).json({ abonnement, paiement });
}));

// ── GET /api/paiements/mes — historique élève ─────────────────────────────────
paiementRouter.get('/mes', isAuth, expressAsyncHandler(async (req, res) => {
  const paiements = await Paiement.find({ eleveId: req.user._id })
    .populate({ path: 'abonnementId', populate: { path: 'planId', select: 'nom prix' } })
    .sort({ createdAt: -1 });
  res.json(paiements);
}));

// ── GET /api/paiements/admin — tous (admin) ───────────────────────────────────
paiementRouter.get('/admin', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.statut)  filter.statut  = req.query.statut;
  if (req.query.methode) filter.methode = req.query.methode;
  const paiements = await Paiement.find(filter)
    .populate('eleveId', 'name email')
    .populate({ path: 'abonnementId', populate: { path: 'planId', select: 'nom prix' } })
    .sort({ createdAt: -1 });
  res.json(paiements);
}));

// ── PUT /api/paiements/:id/confirmer — confirmer paiement manuel (admin) ──────
paiementRouter.put('/:id/confirmer', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  const paiement = await Paiement.findById(req.params.id);
  if (!paiement) return res.status(404).json({ message: 'Paiement introuvable' });

  paiement.statut = 'payé';
  paiement.note = req.body.note || null;
  await paiement.save();

  // Activer l'abonnement
  await Abonnement.findByIdAndUpdate(paiement.abonnementId, { statut: 'actif' });

  res.json({ message: 'Paiement confirmé et abonnement activé', paiement });
}));

// ── PUT /api/paiements/:id/rembourser — rembourser (admin) ───────────────────
paiementRouter.put('/:id/rembourser', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  const paiement = await Paiement.findById(req.params.id);
  if (!paiement) return res.status(404).json({ message: 'Introuvable' });

  paiement.statut = 'remboursé';
  paiement.note = req.body.note || null;
  await paiement.save();

  await Abonnement.findByIdAndUpdate(paiement.abonnementId, { statut: 'suspendu' });
  res.json({ message: 'Paiement remboursé', paiement });
}));

// ── POST /api/paiements/manuel — déclarer paiement manuel (admin) ─────────────
paiementRouter.post('/manuel', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  const { eleveId, planId, methode, note, dureesMois } = req.body;

  const plan = await Plan.findById(planId);
  if (!plan) return res.status(404).json({ message: 'Plan introuvable' });

  const dateDebut = new Date();
  const dateEcheance = new Date();
  dateEcheance.setMonth(dateEcheance.getMonth() + (dureesMois || plan.dureeEngagement));

  const abonnement = await Abonnement.create({
    eleveId, planId,
    dateDebut, dateEcheance,
    statut: 'actif',
    methodePaiement: methode || 'especes',
  });

  const paiement = await Paiement.create({
    abonnementId: abonnement._id,
    eleveId,
    montant: plan.prix,
    statut: 'payé',
    methode: methode || 'especes',
    periode: { debut: dateDebut, fin: dateEcheance },
    note: note || null,
  });

  res.status(201).json({ abonnement, paiement });
}));

export default paiementRouter;
