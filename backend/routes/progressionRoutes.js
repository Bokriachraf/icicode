import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Progression from '../models/progressionModel.js';
import Chapitre from '../models/chapitreModel.js';
import { isAuth, isAdmin, isProf, hasActiveAbonnement } from '../utils.js';

const progressionRouter = express.Router();

// GET /api/progression — progression de l'élève connecté
progressionRouter.get(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const progressions = await Progression.find({ userId: req.user._id })
      .populate('chapitreId', 'titre ordre niveauId')
      .sort({ createdAt: 1 });
    res.json(progressions);
  })
);

// GET /api/progression/:chapitreId — progression sur un chapitre précis
progressionRouter.get(
  '/:chapitreId',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const progression = await Progression.findOne({
      userId: req.user._id,
      chapitreId: req.params.chapitreId,
    }).populate('chapitreId');
    if (!progression) {
      return res.json({ mathStatus: 'non_commencé', pythonStatus: 'verrouillé', exercicesRendus: [] });
    }
    res.json(progression);
  })
);

// POST /api/progression/demarrer — démarrer la partie Math d'un chapitre
progressionRouter.post(
  '/demarrer',
  isAuth,
  hasActiveAbonnement,
  expressAsyncHandler(async (req, res) => {
    const { chapitreId } = req.body;
    let progression = await Progression.findOne({ userId: req.user._id, chapitreId });
    if (!progression) {
      progression = await Progression.create({
        userId: req.user._id,
        chapitreId,
        mathStatus: 'en_cours',
        debutMathA: new Date(),
      });
    }
    res.json(progression);
  })
);

// PUT /api/progression/terminer-math — terminer la partie Math → déverrouille Python
progressionRouter.put(
  '/terminer-math',
  isAuth,
  hasActiveAbonnement,
  expressAsyncHandler(async (req, res) => {
    const { chapitreId } = req.body;
    const chapitre = await Chapitre.findById(chapitreId);
    const pythonStatus = chapitre?.python?.debloquéApres === 'immediat' ? 'en_cours' : 'en_cours';

    const progression = await Progression.findOneAndUpdate(
      { userId: req.user._id, chapitreId },
      {
        mathStatus: 'terminé',
        finMathA: new Date(),
        pythonStatus,
        debutPythonA: new Date(),
      },
      { new: true, upsert: true }
    );
    res.json(progression);
  })
);

// POST /api/progression/soumettre — soumettre un exercice
progressionRouter.post(
  '/soumettre',
  isAuth,
  hasActiveAbonnement,
  expressAsyncHandler(async (req, res) => {
    const { chapitreId, exerciceId, reponse, validation } = req.body;

    const statut = validation === 'auto' ? 'validé' : 'en_attente';
    const score = validation === 'auto' ? req.body.score || 0 : 0;

    const progression = await Progression.findOneAndUpdate(
      { userId: req.user._id, chapitreId },
      {
        $push: {
          exercicesRendus: {
            exerciceId,
            reponse,
            score,
            validePar: validation,
            statut,
            soumisA: new Date(),
          },
        },
        $inc: { scoreTotal: score },
      },
      { new: true, upsert: true }
    );
    res.json(progression);
  })
);

// PUT /api/progression/valider-prof — le prof valide un exercice projet_libre
progressionRouter.put(
  '/valider-prof',
  isAuth,
  isProf,
  expressAsyncHandler(async (req, res) => {
    const { userId, chapitreId, exerciceId, score, commentaire } = req.body;

    const progression = await Progression.findOneAndUpdate(
      {
        userId,
        chapitreId,
        'exercicesRendus.exerciceId': exerciceId,
      },
      {
        $set: {
          'exercicesRendus.$.score': score,
          'exercicesRendus.$.statut': 'validé',
          'exercicesRendus.$.validePar': 'prof',
          'exercicesRendus.$.commentaireProf': commentaire,
        },
        $inc: { scoreTotal: score },
      },
      { new: true }
    );
    res.json(progression);
  })
);

// GET /api/progression/admin/tous — toutes les progressions (admin)
progressionRouter.get(
  '/admin/tous',
  isAuth,
  isProf,
  expressAsyncHandler(async (req, res) => {
    const filter = {};
    if (req.query.chapitreId) filter.chapitreId = req.query.chapitreId;
    if (req.query.userId) filter.userId = req.query.userId;
    const progressions = await Progression.find(filter)
      .populate('userId', 'name email niveauId')
      .populate('chapitreId', 'titre');
    res.json(progressions);
  })
);

export default progressionRouter;
