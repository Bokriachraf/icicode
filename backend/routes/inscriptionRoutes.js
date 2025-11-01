import express from 'express'
import Inscription from '../models/inscriptionModel.js'
import { isAuth, isAdmin } from '../utils.js'
import User from '../models/userModel.js';

const router = express.Router()

router.post('/', isAuth,async (req, res) => {
  if (!req.user || !req.user._id) {
  return res.status(401).json({ error: 'Utilisateur non authentifié' })
}
  try {
    const newInscription = new Inscription({
      ...req.body,
      user: req.user._id, // Associer au user connecté
    })
    await newInscription.save()
    res.status(201).json({
       message: 'Inscription enregistré' ,
      inscription: newInscription,
    })
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l’enregistrement' })
  }
}) 
router.get('/mine', isAuth, async (req, res) => {
  try {
    const inscription = await Inscription.find({ user: req.user._id })
    res.json(inscription)
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des inscription' })
  }
})
router.get('/admin', isAuth, isAdmin, async (req, res) => {
  try {
   const allInscription = await Inscription.find({ user: { $ne: null } }).populate('user', 'name email')
    res.json(allInscription)
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' })
  }
})

router.get('/admin/:id', isAuth, isAdmin, async (req, res) => {
  try {
    const inscription = await Inscription.findById(req.params.id).populate('user', 'name email')
    if (!inscription) {
      return res.status(404).json({ message: 'Inscription non trouvé' })
    }
    res.json(inscription)
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du inscription' })
  }
})
router.delete('/:id', isAuth, isAdmin, async (req, res) => {
  try {
    const inscription = await Inscription.findById(req.params.id)
    if (inscription) {
      await inscription.deleteOne()
      res.json({ message: 'Inscription supprimé' })
    } else {
      res.status(404).json({ message: 'Introuvable' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' })
  }
})

router.put('/:id/status', isAuth, isAdmin, async (req, res) => {
  try {
    const inscription = await Inscription.findById(req.params.id)
    if (inscription) {
      inscription.status = req.body.status || inscription.status
      const updated = await inscription.save()
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
    const inscription = await Inscription.findById(req.params.id)

    if (inscription) {
      // Vérifie que le inscription appartient au user connecté
      if (inscription.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Accès interdit' })
      }

      res.json(inscription)
    } else {
      res.status(404).json({ error: 'Inscription non trouvé' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du inscription' })
  }
})
router.put('/admin/marque-comme-vu', isAuth, isAdmin, async (req, res) => {
  try {
    await Inscription.updateMany({ vu: false }, { $set: { vu: true } })
    res.json({ message: 'Tous les inscription ont été marqués comme vus' })
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' })
  }
})

// ✅ Route : compléter l'inscription (mise à jour du profil utilisateur)
router.put('/complete', isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Mise à jour des informations du profil
    user.nom = req.body.nom || user.nom;
    user.prenom = req.body.prenom || user.prenom;
    user.email = req.body.email || user.email;
    user.adresse = req.body.adresse || user.adresse;
    user.tel = req.body.tel || user.tel;
    user.niveauEtude = req.body.niveauEtude || user.niveauEtude;
    user.sourceDecouverte = req.body.sourceDecouverte || user.sourceDecouverte;
    user.newsletterConsent = req.body.newsletterConsent ?? user.newsletterConsent;

    // ✅ Statut de complétion
    user.isInscriptionComplete = true;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      nom: updatedUser.nom,
      prenom: updatedUser.prenom,
      email: updatedUser.email,
      adresse: updatedUser.adresse,
      tel: updatedUser.tel,
      niveauEtude: updatedUser.niveauEtude,
      sourceDecouverte: updatedUser.sourceDecouverte,
      newsletterConsent: updatedUser.newsletterConsent,
      isInscriptionComplete: updatedUser.isInscriptionComplete,
      isAdmin: updatedUser.isAdmin,
    });
  } catch (error) {
    console.error('Erreur lors de la complétion du profil :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});



export default router