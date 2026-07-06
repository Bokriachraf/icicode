import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Affectation from '../models/affectationModel.js';
import Groupe from '../models/groupeModel.js';
import { isAuth, isProf } from '../utils.js';

const affectationRouter = express.Router();

// ── POST /api/affectations — créer une affectation (prof/admin) ──────────────
affectationRouter.post(
  '/',
  isAuth,
  isProf,
  expressAsyncHandler(async (req, res) => {
    const { exerciceId, cible, seanceId, groupeId, eleveId, dateEcheance } = req.body;

    if (!exerciceId || !cible) {
      return res.status(400).json({ message: 'exerciceId et cible sont obligatoires' });
    }
    if (cible === 'seance'  && !seanceId)  return res.status(400).json({ message: 'seanceId requis' });
    if (cible === 'groupe'  && !groupeId)  return res.status(400).json({ message: 'groupeId requis' });
    if (cible === 'eleve'   && !eleveId)   return res.status(400).json({ message: 'eleveId requis' });

    // Évite les doublons
    const exist = await Affectation.findOne({ exerciceId, cible, seanceId, groupeId, eleveId });
    if (exist) return res.status(400).json({ message: 'Exercice déjà affecté à cette cible' });

    const affectation = await Affectation.create({
      exerciceId,
      cible,
      seanceId:    seanceId    || null,
      groupeId:    groupeId    || null,
      eleveId:     eleveId     || null,
      dateEcheance: dateEcheance || null,
      creePar: req.user._id,
    });

    res.status(201).json(affectation);
  })
);

// ── POST /api/affectations/bulk — affecter plusieurs exercices d'un coup ─────
affectationRouter.post(
  '/bulk',
  isAuth,
  isProf,
  expressAsyncHandler(async (req, res) => {
    const { exerciceIds, cible, seanceId, groupeId, eleveId, dateEcheance } = req.body;

    if (!exerciceIds?.length || !cible) {
      return res.status(400).json({ message: 'exerciceIds et cible sont obligatoires' });
    }

    const docs = exerciceIds.map(exerciceId => ({
      exerciceId,
      cible,
      seanceId:    seanceId    || null,
      groupeId:    groupeId    || null,
      eleveId:     eleveId     || null,
      dateEcheance: dateEcheance || null,
      creePar: req.user._id,
    }));

    // insertMany avec ordered:false pour ignorer les doublons
    const result = await Affectation.insertMany(docs, { ordered: false }).catch(e => {
      if (e.code === 11000) return e.insertedDocs || [];
      throw e;
    });

    res.status(201).json({ message: `${Array.isArray(result) ? result.length : 0} affectation(s) créée(s)` });
  })
);

// ── GET /api/affectations/eleve — exercices affectés à l'élève connecté ──────
// Agrège : affectations directes + via groupe + via séance du groupe
affectationRouter.get(
  '/eleve',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const userId = req.user._id;

    // 1. Groupes de l'élève
    const groupes = await Groupe.find({ eleves: userId }).select('_id');
    const groupeIds = groupes.map(g => g._id);

    // 2. Toutes les affectations qui le concernent
    const affectations = await Affectation.find({
      $or: [
        { cible: 'eleve',  eleveId: userId },
        { cible: 'groupe', groupeId: { $in: groupeIds } },
        { cible: 'seance', seanceId: { $ne: null } }, // filtré ci-dessous
      ],
    })
      .populate('exerciceId')
      .populate('seanceId', 'groupeId titre statut')
      .populate('groupeId', 'nom eleves')
      .sort({ createdAt: -1 });

    // 3. Filtrer les affectations séance : garder seulement si la séance appartient à un groupe de l'élève
    const groupeIdStrings = groupeIds.map(id => id.toString());
    const filtered = affectations.filter(a => {
      if (a.cible === 'seance') {
        return groupeIdStrings.includes(a.seanceId?.groupeId?.toString());
      }
      return true;
    });

    res.json(filtered);
  })
);

// ── GET /api/affectations/eleve/:chapitreId — exercices d'un chapitre pour l'élève
affectationRouter.get(
  '/eleve/:chapitreId',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { chapitreId } = req.params;

    const groupes = await Groupe.find({ eleves: userId }).select('_id');
    const groupeIds = groupes.map(g => g._id);

    const affectations = await Affectation.find({
      $or: [
        { cible: 'eleve',  eleveId: userId },
        { cible: 'groupe', groupeId: { $in: groupeIds } },
        { cible: 'seance' },
      ],
    })
      .populate({
        path: 'exerciceId',
        match: { chapitreId }, // seulement les exercices de CE chapitre
      })
      .populate('seanceId', 'groupeId')
      .sort({ createdAt: 1 });

    // Filtrer les exercices null (populate match non satisfait) + séances hors groupe
    const groupeIdStrings = groupeIds.map(id => id.toString());
    const result = affectations.filter(a => {
      if (!a.exerciceId) return false;
      if (a.cible === 'seance') {
        return groupeIdStrings.includes(a.seanceId?.groupeId?.toString());
      }
      return true;
    });

    res.json(result);
  })
);

// ── GET /api/affectations — toutes (prof/admin, filtrable) ───────────────────
affectationRouter.get(
  '/',
  isAuth,
  isProf,
  expressAsyncHandler(async (req, res) => {
    const filter = {};
    if (req.query.seanceId)  filter.seanceId  = req.query.seanceId;
    if (req.query.groupeId)  filter.groupeId  = req.query.groupeId;
    if (req.query.eleveId)   filter.eleveId   = req.query.eleveId;
    if (req.query.cible)     filter.cible     = req.query.cible;

    const affectations = await Affectation.find(filter)
      .populate('exerciceId', 'enonce type type_partie scoreMax')
      .populate('seanceId',   'titre dateHeure')
      .populate('groupeId',   'nom')
      .populate('eleveId',    'name email')
      .sort({ createdAt: -1 });

    res.json(affectations);
  })
);

// ── DELETE /api/affectations/:id ─────────────────────────────────────────────
affectationRouter.delete(
  '/:id',
  isAuth,
  isProf,
  expressAsyncHandler(async (req, res) => {
    const affectation = await Affectation.findByIdAndDelete(req.params.id);
    if (!affectation) return res.status(404).json({ message: 'Affectation introuvable' });
    res.json({ message: 'Affectation supprimée' });
  })
);

export default affectationRouter;
