import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Seance from '../models/seanceModel.js';
import Groupe from '../models/groupeModel.js';
import { isAuth, isProf } from '../utils.js';

const seanceRouter = express.Router();

// GET /api/seances — liste des séances
//  - admin/prof : voit tout, filtrable par niveauId / groupeId / statut
//  - élève      : ne voit QUE les séances des groupes dont il est membre
seanceRouter.get(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const filter = {};

    if (req.user.isAdmin || req.user.role === 'prof') {
      if (req.query.niveauId) filter.niveauId = req.query.niveauId;
      if (req.query.groupeId) filter.groupeId = req.query.groupeId;
      if (req.query.statut) filter.statut = req.query.statut;
    } else {
      // Élève : on ignore niveauId, on ne filtre que par ses groupes réels
      const mesGroupes = await Groupe.find({ eleves: req.user._id, actif: true }).select('_id');
      const groupeIds = mesGroupes.map((g) => g._id);
      if (groupeIds.length === 0) {
        return res.json([]); // aucun groupe → aucune séance visible
      }
      filter.groupeId = { $in: groupeIds };
      if (req.query.statut) filter.statut = req.query.statut;
    }

    const seances = await Seance.find(filter)
      .populate('chapitreId', 'titre')
      .populate('niveauId', 'nom equivalenceFrance')
      .populate('groupeId', 'nom')
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
      .populate('niveauId', 'nom')
      .populate('groupeId', 'nom eleves');
    if (!seance) return res.status(404).json({ message: 'Séance introuvable' });

    // Un élève ne peut consulter que les séances de ses propres groupes
    if (!req.user.isAdmin && req.user.role !== 'prof') {
      const estMembre = seance.groupeId?.eleves?.some(
        (id) => id.toString() === req.user._id.toString()
      );
      if (!estMembre) return res.status(403).json({ message: 'Accès interdit' });
    }

    res.json(seance);
  })
);

// POST /api/seances — créer une séance (admin/prof), ciblée sur UN groupe
seanceRouter.post(
  '/',
  isAuth,
  isProf,
  expressAsyncHandler(async (req, res) => {
    const { chapitreId, groupeId, titre, dateHeure, duree } = req.body;

    if (!groupeId) {
      return res.status(400).json({ message: 'groupeId est obligatoire' });
    }
    const groupe = await Groupe.findById(groupeId);
    if (!groupe) return res.status(404).json({ message: 'Groupe introuvable' });

    // Génère un roomId unique pour Jitsi
    const roomId = `seance-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const seance = await Seance.create({
      chapitreId: chapitreId || undefined,
      niveauId: groupe.niveauId, // dérivé automatiquement du groupe
      groupeId,
      titre,
      dateHeure,
      duree,
      roomId,
    });
    res.status(201).json(seance);
  })
);

// PUT /api/seances/:id — modifier une séance (admin/prof)
seanceRouter.put(
  '/:id',
  isAuth,
  isProf,
  expressAsyncHandler(async (req, res) => {
    const update = { ...req.body };

    // Si le groupe change, on re-dérive le niveauId associé
    if (update.groupeId) {
      const groupe = await Groupe.findById(update.groupeId);
      if (!groupe) return res.status(404).json({ message: 'Groupe introuvable' });
      update.niveauId = groupe.niveauId;
    }

    const seance = await Seance.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!seance) return res.status(404).json({ message: 'Séance introuvable' });
    res.json(seance);
  })
);

// DELETE /api/seances/:id — supprimer une séance (admin/prof)
seanceRouter.delete(
  '/:id',
  isAuth,
  isProf,
  expressAsyncHandler(async (req, res) => {
    const seance = await Seance.findByIdAndDelete(req.params.id);
    if (!seance) return res.status(404).json({ message: 'Séance introuvable' });
    res.json({ message: 'Séance supprimée' });
  })
);

// POST /api/seances/:id/token — générer l'URL Jitsi pour rejoindre
seanceRouter.post(
  '/:id/token',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const seance = await Seance.findById(req.params.id).populate('groupeId', 'eleves');
    if (!seance) return res.status(404).json({ message: 'Séance introuvable' });

    // Un élève ne peut rejoindre que la séance de son propre groupe
    if (!req.user.isAdmin && req.user.role !== 'prof') {
      const estMembre = seance.groupeId?.eleves?.some(
        (id) => id.toString() === req.user._id.toString()
      );
      if (!estMembre) return res.status(403).json({ message: 'Accès interdit' });

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

// PUT /api/seances/:id/terminer — terminer la séance et ajouter le replay (admin/prof)
seanceRouter.put(
  '/:id/terminer',
  isAuth,
  isProf,
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
