import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import Groupe from '../models/groupeModel.js'
import User from '../models/userModel.js'
import { isAuth, isProf } from '../utils.js'

const groupeRouter = express.Router()

// GET /api/groupes — liste des groupes (filtrable par niveauId)
groupeRouter.get(
  '/',
  isAuth,
  isProf,
  expressAsyncHandler(async (req, res) => {
    const filter = {}
    if (req.query.niveauId) filter.niveauId = req.query.niveauId
    const groupes = await Groupe.find(filter)
      .populate('niveauId', 'nom categorie')
      .populate('eleves', 'name email')
      .sort({ createdAt: -1 })
    res.json(groupes)
  })
)

// GET /api/groupes/eleves-disponibles?niveauId=... — élèves validés de ce niveau,
// pas encore dans un groupe actif de ce même niveau
groupeRouter.get(
  '/eleves-disponibles',
  isAuth,
  isProf,
  expressAsyncHandler(async (req, res) => {
    const { niveauId } = req.query
    if (!niveauId) return res.status(400).json({ message: 'niveauId requis' })

    const groupesDuNiveau = await Groupe.find({ niveauId, actif: true }).select('eleves')
    const idsDejaDansGroupe = groupesDuNiveau.flatMap(g => g.eleves.map(e => e.toString()))

    const eleves = await User.find({
      niveauId,
      role: 'etudiant',
      _id: { $nin: idsDejaDansGroupe },
    }).select('name email')

    res.json(eleves)
  })
)

// GET /api/groupes/:id
groupeRouter.get(
  '/:id',
  isAuth,
  isProf,
  expressAsyncHandler(async (req, res) => {
    const groupe = await Groupe.findById(req.params.id)
      .populate('niveauId', 'nom categorie')
      .populate('eleves', 'name email')
    if (!groupe) return res.status(404).json({ message: 'Groupe introuvable' })
    res.json(groupe)
  })
)

// POST /api/groupes — créer un groupe
groupeRouter.post(
  '/',
  isAuth,
  isProf,
  expressAsyncHandler(async (req, res) => {
    const { nom, niveauId } = req.body
    if (!nom || !niveauId) {
      return res.status(400).json({ message: 'nom et niveauId sont obligatoires' })
    }
    const groupe = await Groupe.create({ nom, niveauId, eleves: [] })
    res.status(201).json(groupe)
  })
)

// PUT /api/groupes/:id — modifier nom / actif
groupeRouter.put(
  '/:id',
  isAuth,
  isProf,
  expressAsyncHandler(async (req, res) => {
    const groupe = await Groupe.findByIdAndUpdate(
      req.params.id,
      { nom: req.body.nom, actif: req.body.actif },
      { new: true }
    )
    if (!groupe) return res.status(404).json({ message: 'Groupe introuvable' })
    res.json(groupe)
  })
)

// DELETE /api/groupes/:id
groupeRouter.delete(
  '/:id',
  isAuth,
  isProf,
  expressAsyncHandler(async (req, res) => {
    const groupe = await Groupe.findByIdAndDelete(req.params.id)
    if (!groupe) return res.status(404).json({ message: 'Groupe introuvable' })
    res.json({ message: 'Groupe supprimé' })
  })
)

// PUT /api/groupes/:id/ajouter — ajouter un élève au groupe
groupeRouter.put(
  '/:id/ajouter',
  isAuth,
  isProf,
  expressAsyncHandler(async (req, res) => {
    const { userId } = req.body
    if (!userId) return res.status(400).json({ message: 'userId requis' })

    const groupe = await Groupe.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { eleves: userId } },
      { new: true }
    ).populate('eleves', 'name email')
    if (!groupe) return res.status(404).json({ message: 'Groupe introuvable' })
    res.json(groupe)
  })
)

// PUT /api/groupes/:id/retirer — retirer un élève du groupe
groupeRouter.put(
  '/:id/retirer',
  isAuth,
  isProf,
  expressAsyncHandler(async (req, res) => {
    const { userId } = req.body
    if (!userId) return res.status(400).json({ message: 'userId requis' })

    const groupe = await Groupe.findByIdAndUpdate(
      req.params.id,
      { $pull: { eleves: userId } },
      { new: true }
    ).populate('eleves', 'name email')
    if (!groupe) return res.status(404).json({ message: 'Groupe introuvable' })
    res.json(groupe)
  })
)

export default groupeRouter
