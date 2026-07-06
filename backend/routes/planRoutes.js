import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Plan from '../models/planModel.js';
import { isAuth, isAdmin } from '../utils.js';

const planRouter = express.Router();

// GET /api/plans — plans actifs (public, filtrable par niveauId)
planRouter.get('/', expressAsyncHandler(async (req, res) => {
  const filter = { actif: true };
  if (req.query.niveauId) filter.niveauId = req.query.niveauId;
  const plans = await Plan.find(filter)
    .populate('niveauId', 'nom categorie equivalenceFrance')
    .sort({ createdAt: 1 });
  res.json(plans);
}));

// GET /api/plans/admin — tous les plans (admin)
planRouter.get('/admin', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  const plans = await Plan.find({})
    .populate('niveauId', 'nom categorie equivalenceFrance')
    .sort({ createdAt: -1 });
  res.json(plans);
}));

// GET /api/plans/:id
planRouter.get('/:id', expressAsyncHandler(async (req, res) => {
  const plan = await Plan.findById(req.params.id).populate('niveauId', 'nom');
  if (!plan) return res.status(404).json({ message: 'Plan introuvable' });
  res.json(plan);
}));

// POST /api/plans — créer (admin)
planRouter.post('/', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  const plan = await Plan.create(req.body);
  res.status(201).json(plan);
}));

// PUT /api/plans/:id — modifier (admin)
planRouter.put('/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!plan) return res.status(404).json({ message: 'Plan introuvable' });
  res.json(plan);
}));

// DELETE /api/plans/:id — désactiver (admin)
planRouter.delete('/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  await Plan.findByIdAndUpdate(req.params.id, { actif: false });
  res.json({ message: 'Plan désactivé' });
}));

export default planRouter;
