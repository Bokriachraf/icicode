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
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vu: {
    type: Boolean,
    default: false,
    },
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
