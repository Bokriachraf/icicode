import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Niveau from '../models/niveauModel.js';
import { isAuth, isAdmin } from '../utils.js';

const niveauRouter = express.Router();

// GET /api/niveaux — liste tous les niveaux (public, pour l'inscription)
niveauRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const niveaux = await Niveau.find({ actif: true }).sort({ ordre: 1 });
    res.json(niveaux);
  })
);

// POST /api/niveaux — créer un niveau (admin)
niveauRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { nom, equivalenceFrance, ordre, type, description } = req.body;
    const niveau = await Niveau.create({ nom, equivalenceFrance, ordre, type, description });
    res.status(201).json(niveau);
  })
);

// PUT /api/niveaux/:id — modifier un niveau (admin)
niveauRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const niveau = await Niveau.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!niveau) return res.status(404).json({ message: 'Niveau introuvable' });
    res.json(niveau);
  })
);

// DELETE /api/niveaux/:id — désactiver un niveau (admin)
niveauRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const niveau = await Niveau.findByIdAndUpdate(req.params.id, { actif: false }, { new: true });
    if (!niveau) return res.status(404).json({ message: 'Niveau introuvable' });
    res.json({ message: 'Niveau désactivé' });
  })
);

export default niveauRouter;
