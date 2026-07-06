import mongoose from 'mongoose'

const groupeSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    niveauId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Niveau',
      required: true,
    },
    eleves: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    actif: { type: Boolean, default: true },
  },
  { timestamps: true }
)

const Groupe = mongoose.models.Groupe || mongoose.model('Groupe', groupeSchema)
export default Groupe
