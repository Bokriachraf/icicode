import mongoose from 'mongoose';

const planSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    formation: { type: String, required: true }, // ex: "Mathématiques & Python", "Gaming"...
    niveauId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Niveau',
      required: true,
    },
    prix: { type: Number, required: true }, // TND/mois
    dureeEngagement: { type: Number, enum: [1, 3, 6, 12], default: 1 },
    description: { type: String },
    actif: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Plan = mongoose.model('Plan', planSchema);
export default Plan;
