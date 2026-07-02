import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Exercice from '../models/exerciceModel.js';
import { isAuth, isAdmin } from '../utils.js';

const exerciceRouter = express.Router();

// GET /api/exercices?chapitreId=xxx&type_partie=python
exerciceRouter.get(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const filter = {};
    if (req.query.chapitreId) filter.chapitreId = req.query.chapitreId;
    if (req.query.type_partie) filter.type_partie = req.query.type_partie;
    const exercices = await Exercice.find(filter).sort({ ordre: 1 });
    res.json(exercices);
  })
);

// GET /api/exercices/:id
exerciceRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const exercice = await Exercice.findById(req.params.id);
    if (!exercice) return res.status(404).json({ message: 'Exercice introuvable' });
    res.json(exercice);
  })
);

// POST /api/exercices — créer (admin)
exerciceRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const exercice = await Exercice.create(req.body);
    res.status(201).json(exercice);
  })
);

// PUT /api/exercices/:id — modifier (admin)
exerciceRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const exercice = await Exercice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!exercice) return res.status(404).json({ message: 'Exercice introuvable' });
    res.json(exercice);
  })
);

// DELETE /api/exercices/:id
exerciceRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    await Exercice.findByIdAndDelete(req.params.id);
    res.json({ message: 'Exercice supprimé' });
  })
);

export default exerciceRouter;
