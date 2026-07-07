import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Abonnement from '../models/abonnementModel.js';
import Plan from '../models/planModel.js';
import { isAuth, isAdmin } from '../utils.js';

const abonnementRouter = express.Router();

// GET /api/abonnements/mon — abonnement actif de l'élève connecté
abonnementRouter.get('/mon', isAuth, expressAsyncHandler(async (req, res) => {
  // Expire automatiquement (en base) tout abonnement 'actif' dont l'échéance est dépassée
  await Abonnement.updateMany(
    { eleveId: req.user._id, statut: 'actif', dateEcheance: { $lt: new Date() } },
    { $set: { statut: 'expiré' } }
  );

  const abonnement = await Abonnement.findOne({
    eleveId: req.user._id,
    statut: 'actif',
    dateEcheance: { $gte: new Date() },
  }).populate({ path: 'planId', populate: { path: 'niveauId', select: 'nom' } });
  res.json(abonnement || null);
}));

// GET /api/abonnements/admin — tous (admin)
abonnementRouter.get('/admin', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.statut) filter.statut = req.query.statut;
  const abonnements = await Abonnement.find(filter)
    .populate('eleveId', 'name email niveauId')
    .populate({ path: 'planId', populate: { path: 'niveauId', select: 'nom' } })
    .sort({ createdAt: -1 });
  res.json(abonnements);
}));

// POST /api/abonnements — créer manuellement (admin)
abonnementRouter.post('/', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  const { eleveId, planId, prixPersonnalise, methodePaiement, dureesMois } = req.body;

  const plan = await Plan.findById(planId);
  if (!plan) return res.status(404).json({ message: 'Plan introuvable' });

  const dateDebut = new Date();
  const dateEcheance = new Date();
  dateEcheance.setMonth(dateEcheance.getMonth() + (dureesMois || plan.dureeEngagement));

  const abonnement = await Abonnement.create({
    eleveId,
    planId,
    prixPersonnalise: prixPersonnalise || null,
    dateDebut,
    dateEcheance,
    statut: 'actif',
    methodePaiement: methodePaiement || 'especes',
  });

  res.status(201).json(abonnement);
}));

// PUT /api/abonnements/:id/statut — changer statut (admin)
abonnementRouter.put('/:id/statut', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  const abonnement = await Abonnement.findByIdAndUpdate(
    req.params.id,
    { statut: req.body.statut },
    { new: true }
  ).populate('eleveId', 'name email').populate('planId', 'nom prix');
  if (!abonnement) return res.status(404).json({ message: 'Abonnement introuvable' });
  res.json(abonnement);
}));

// PUT /api/abonnements/:id/prix — prix personnalisé (admin)
abonnementRouter.put('/:id/prix', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  const abonnement = await Abonnement.findByIdAndUpdate(
    req.params.id,
    { prixPersonnalise: req.body.prixPersonnalise },
    { new: true }
  );
  if (!abonnement) return res.status(404).json({ message: 'Introuvable' });
  res.json(abonnement);
}));

export default abonnementRouter;
