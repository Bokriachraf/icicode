import mongoose from 'mongoose'

const inscriptionSchema = new mongoose.Schema(
  {
    formation: { type: String, required: true },
    mode: { type: String },
    disponibilite: { type: String },
    adresse: { type: String },
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    email: { type: String, required: true },
    tel: { type: String },
    niveauId: { type: mongoose.Schema.Types.ObjectId, ref: 'Niveau', default: null },
    sourceDecouverte: { type: String, default: null },
    newsletterConsent: { type: Boolean, default: false },
    commentaireEleve: { type: String, default: null },
    commentaireAdmin: { type: String, default: null },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vu: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['En attente', 'En cours', 'Validé', 'Rejeté'],
      default: 'En attente',
    },
  },
  { timestamps: true }
)

const Inscription = mongoose.models.Inscription || mongoose.model('Inscription', inscriptionSchema)
export default Inscription
