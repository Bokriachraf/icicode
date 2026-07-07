import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Chapitre from '../models/chapitreModel.js';
import { isAuth, isAdmin, isProf, hasActiveAbonnement } from '../utils.js';

const chapitreRouter = express.Router();

// GET /api/chapitres?niveauId=xxx — chapitres d'un niveau
chapitreRouter.get(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const filter = { actif: true };
    if (req.query.niveauId) filter.niveauId = req.query.niveauId;
    const chapitres = await Chapitre.find(filter)
      .populate('niveauId', 'nom equivalenceFrance')
      .populate('math.exercices')
      .populate('python.exercices')
      .sort({ ordre: 1 });
    res.json(chapitres);
  })
);

// GET /api/chapitres/:id — détail d'un chapitre (nécessite un abonnement actif pour un élève)
chapitreRouter.get(
  '/:id',
  isAuth,
  hasActiveAbonnement,
  expressAsyncHandler(async (req, res) => {
    const chapitre = await Chapitre.findById(req.params.id)
      .populate('niveauId', 'nom equivalenceFrance')
      .populate('math.exercices')
      .populate('python.exercices');
    if (!chapitre) return res.status(404).json({ message: 'Chapitre introuvable' });
    res.json(chapitre);
  })
);

// POST /api/chapitres — créer un chapitre (admin)
chapitreRouter.post(
  '/',
  isAuth,
  isProf,
  expressAsyncHandler(async (req, res) => {
    const chapitre = await Chapitre.create(req.body);
    res.status(201).json(chapitre);
  })
);

// PUT /api/chapitres/:id — modifier un chapitre (admin)
chapitreRouter.put(
  '/:id',
  isAuth,
  isProf,
  expressAsyncHandler(async (req, res) => {
    const chapitre = await Chapitre.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!chapitre) return res.status(404).json({ message: 'Chapitre introuvable' });
    res.json(chapitre);
  })
);

// DELETE /api/chapitres/:id — désactiver (admin)
chapitreRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const chapitre = await Chapitre.findByIdAndUpdate(req.params.id, { actif: false }, { new: true });
    if (!chapitre) return res.status(404).json({ message: 'Chapitre introuvable' });
    res.json({ message: 'Chapitre désactivé' });
  })
);

export default chapitreRouter;
