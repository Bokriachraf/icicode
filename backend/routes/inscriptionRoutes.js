import express from 'express'
import Inscription from '../models/inscriptionModel.js'
import { isAuth, isAdmin } from '../utils.js'
import User from '../models/userModel.js'

const router = express.Router()

// ─── Routes fixes (TOUJOURS avant /:id) ───────────────────────────────────────

// POST / — créer une inscription
router.post('/', isAuth, async (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(401).json({ error: 'Utilisateur non authentifié' })
  }
  try {
    const newInscription = new Inscription({
      ...req.body,
      user:              req.user._id,
      niveauId:          req.body.niveauId          || null,
      sourceDecouverte:  req.body.sourceDecouverte  || null,
      newsletterConsent: req.body.newsletterConsent || false,
      commentaireEleve:  req.body.commentaireEleve  || null,
    })
    await newInscription.save()

    const populated = await Inscription.findById(newInscription._id)
      .populate('niveauId', 'nom categorie systeme equivalenceFrance')

    res.status(201).json({ message: 'Inscription enregistrée', inscription: populated })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Erreur lors de l'enregistrement" })
  }
})

// GET /mine — mes inscriptions
router.get('/mine', isAuth, async (req, res) => {
  try {
    const inscription = await Inscription.find({ user: req.user._id })
      .populate('niveauId', 'nom categorie systeme equivalenceFrance')
      .sort({ createdAt: -1 })
    res.json(inscription)
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des inscriptions' })
  }
})

// PUT /complete — compléter le profil utilisateur
// Utilise findByIdAndUpdate + $set pour éviter la revalidation
// du champ password (absent pour les comptes Google OAuth)
router.put('/complete', isAuth, async (req, res) => {
  try {
    const update = {
      $set: {
        nom:                   req.body.nom               ?? undefined,
        prenom:                req.body.prenom            ?? undefined,
        email:                 req.body.email             ?? undefined,
        tel:                   req.body.tel               ?? undefined,
        niveauId:              req.body.niveauId          ?? undefined,
        sourceDecouverte:      req.body.sourceDecouverte  ?? undefined,
        newsletterConsent:     req.body.newsletterConsent ?? undefined,
        isInscriptionComplete: true,
      },
    }

    // Nettoyer les undefined pour ne pas écraser des valeurs existantes
    Object.keys(update.$set).forEach(
      (k) => update.$set[k] === undefined && delete update.$set[k]
    )

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      update,
      {
        new:             true,   // retourner le document mis à jour
        runValidators:   false,  // ne pas revalider password/etc.
      }
    )

    if (!updatedUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' })
    }

    console.log(`✅ User ${updatedUser._id} — niveauId: ${updatedUser.niveauId}`)

    res.json({
      _id:                   updatedUser._id,
      name:                  updatedUser.name,
      email:                 updatedUser.email,
      isAdmin:               updatedUser.isAdmin,
      isInscriptionComplete: updatedUser.isInscriptionComplete,
      niveauId:              updatedUser.niveauId,
    })
  } catch (error) {
    console.error('Erreur completion profil:', error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
})

// GET /admin — toutes les inscriptions (admin)
router.get('/admin', isAuth, isAdmin, async (req, res) => {
  try {
    const allInscription = await Inscription.find({ user: { $ne: null } })
      .populate('user', 'name email')
      .populate('niveauId', 'nom categorie systeme')
      .sort({ createdAt: -1 })
    res.json(allInscription)
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' })
  }
})

// PUT /admin/marque-comme-vu (admin)
router.put('/admin/marque-comme-vu', isAuth, isAdmin, async (req, res) => {
  try {
    await Inscription.updateMany({ vu: false }, { $set: { vu: true } })
    res.json({ message: 'Toutes les inscriptions ont été marquées comme vues' })
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' })
  }
})

// GET /admin/:id (admin)
router.get('/admin/:id', isAuth, isAdmin, async (req, res) => {
  try {
    const inscription = await Inscription.findById(req.params.id)
      .populate('user', 'name email')
      .populate('niveauId', 'nom categorie systeme equivalenceFrance')
    if (!inscription) return res.status(404).json({ message: 'Inscription non trouvée' })
    res.json(inscription)
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération' })
  }
})

// ─── Routes dynamiques /:id (TOUJOURS en dernier) ─────────────────────────────

// GET /:id — détail inscription élève
router.get('/:id', isAuth, async (req, res) => {
  try {
    const inscription = await Inscription.findById(req.params.id)
      .populate('niveauId', 'nom categorie systeme equivalenceFrance')
    if (!inscription) return res.status(404).json({ error: 'Inscription non trouvée' })
    if (inscription.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Accès interdit' })
    }
    res.json(inscription)
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération' })
  }
})

// PUT /:id/status — changer le statut (admin)
router.put('/:id/status', isAuth, isAdmin, async (req, res) => {
  try {
    const inscription = await Inscription.findById(req.params.id)
    if (!inscription) return res.status(404).json({ message: 'Introuvable' })
    inscription.status           = req.body.status           || inscription.status
    inscription.commentaireAdmin = req.body.commentaireAdmin || inscription.commentaireAdmin
    const updated = await inscription.save()
    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' })
  }
})

// DELETE /:id (admin)
router.delete('/:id', isAuth, isAdmin, async (req, res) => {
  try {
    const inscription = await Inscription.findById(req.params.id)
    if (!inscription) return res.status(404).json({ message: 'Introuvable' })
    await inscription.deleteOne()
    res.json({ message: 'Inscription supprimée' })
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' })
  }
})

export default router
