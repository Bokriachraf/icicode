import mongoose from 'mongoose';

const niveauSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    equivalenceFrance: { type: String, default: null },
    ordre: { type: Number, required: true },
    categorie: {
      type: String,
      enum: ['college', 'lycee', 'universite'],
      required: true,
    },
    systeme: {
      type: String,
      enum: ['tunisien', 'francais', 'universite'],
      required: true,
    },
    description: { type: String },
    actif: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Niveau = mongoose.model('Niveau', niveauSchema);
export default Niveau;
