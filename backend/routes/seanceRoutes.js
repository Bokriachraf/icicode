import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Seance from '../models/seanceModel.js';
import { isAuth, isAdmin } from '../utils.js';

const seanceRouter = express.Router();

// GET /api/seances — liste des séances (filtrée par niveauId ou statut)
seanceRouter.get(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const filter = {};
    if (req.query.niveauId) filter.niveauId = req.query.niveauId;
    if (req.query.statut) filter.statut = req.query.statut;
    const seances = await Seance.find(filter)
      .populate('chapitreId', 'titre')
      .populate('niveauId', 'nom equivalenceFrance')
      .sort({ dateHeure: 1 });
    res.json(seances);
  })
);

// GET /api/seances/:id
seanceRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const seance = await Seance.findById(req.params.id)
      .populate('chapitreId')
      .populate('niveauId', 'nom');
    if (!seance) return res.status(404).json({ message: 'Séance introuvable' });
    res.json(seance);
  })
);

// POST /api/seances — créer une séance (admin/prof)
seanceRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { chapitreId, niveauId, titre, dateHeure, duree } = req.body;
    // Génère un roomId unique pour LiveKit
    const roomId = `seance-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const seance = await Seance.create({ chapitreId, niveauId, titre, dateHeure, duree, roomId });
    res.status(201).json(seance);
  })
);

// PUT /api/seances/:id — modifier une séance (admin)
seanceRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const seance = await Seance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!seance) return res.status(404).json({ message: 'Séance introuvable' });
    res.json(seance);
  })
);

// POST /api/seances/:id/token — générer l'URL Jitsi pour rejoindre
seanceRouter.post(
  '/:id/token',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const seance = await Seance.findById(req.params.id);
    if (!seance) return res.status(404).json({ message: 'Séance introuvable' });

    // Enregistre la présence de l'élève
    if (!req.user.isAdmin) {
      await Seance.findByIdAndUpdate(req.params.id, {
        $addToSet: {
          participants: { userId: req.user._id, rejointA: new Date() },
        },
      });
    }

    // URL Jitsi — gratuit, sans config
    const jitsiUrl = `https://meet.jit.si/${seance.roomId}`;
    res.json({ jitsiUrl, roomId: seance.roomId });
  })
);

// PUT /api/seances/:id/terminer — terminer la séance et ajouter le replay (admin)
seanceRouter.put(
  '/:id/terminer',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const seance = await Seance.findByIdAndUpdate(
      req.params.id,
      { statut: 'terminée', replayUrl: req.body.replayUrl || null },
      { new: true }
    );
    res.json(seance);
  })
);

export default seanceRouter;
