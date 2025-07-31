import express from 'express'
import Devis from '../models/devisModel.js'
import { isAuth, isAdmin } from '../utils.js'
const router = express.Router()

router.post('/', isAuth,async (req, res) => {
  if (!req.user || !req.user._id) {
  return res.status(401).json({ error: 'Utilisateur non authentifié' })
}
  try {
    const newDevis = new Devis({
      ...req.body,
      user: req.user._id, // Associer au user connecté
    })
    await newDevis.save()
    res.status(201).json({
       message: 'Devis enregistré' ,
      devis: newDevis,
    })
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l’enregistrement' })
  }
})
router.get('/mine', isAuth, async (req, res) => {
  try {
    const devis = await Devis.find({ user: req.user._id })
    res.json(devis)
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des devis' })
  }
})
router.get('/admin', isAuth, isAdmin, async (req, res) => {
  try {
    // const allDevis = await Devis.find().populate('user', 'name email')
   const allDevis = await Devis.find({ user: { $ne: null } }).populate('user', 'name email')
    res.json(allDevis)
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' })
  }
})

router.get('/admin/:id', isAuth, isAdmin, async (req, res) => {
  try {
    const devis = await Devis.findById(req.params.id).populate('user', 'name email')
    if (!devis) {
      return res.status(404).json({ message: 'Devis non trouvé' })
    }
    res.json(devis)
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du devis' })
  }
})
router.delete('/:id', isAuth, isAdmin, async (req, res) => {
  try {
    const devis = await Devis.findById(req.params.id)
    if (devis) {
      await devis.deleteOne()
      res.json({ message: 'Devis supprimé' })
    } else {
      res.status(404).json({ message: 'Introuvable' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' })
  }
})

router.put('/:id/status', isAuth, isAdmin, async (req, res) => {
  try {
    const devis = await Devis.findById(req.params.id)
    if (devis) {
      devis.status = req.body.status || devis.status
      const updated = await devis.save()
      res.json(updated)
    } else {
      res.status(404).json({ message: 'Introuvable' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' })
  }
})

router.get('/:id', isAuth, async (req, res) => {
  try {
    const devis = await Devis.findById(req.params.id)

    if (devis) {
      // Vérifie que le devis appartient au user connecté
      if (devis.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Accès interdit' })
      }

      res.json(devis)
    } else {
      res.status(404).json({ error: 'Devis non trouvé' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du devis' })
  }
})
router.put('/admin/marque-comme-vu', isAuth, isAdmin, async (req, res) => {
  try {
    await Devis.updateMany({ vu: false }, { $set: { vu: true } })
    res.json({ message: 'Tous les devis ont été marqués comme vus' })
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' })
  }
})

export default router