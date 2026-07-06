import mongoose from 'mongoose';

const affectationSchema = new mongoose.Schema(
  {
    exerciceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercice',
      required: true,
    },
    // Niveau de ciblage
    cible: {
      type: String,
      enum: ['seance', 'groupe', 'eleve'],
      required: true,
    },
    seanceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Seance',
      default: null,
    },
    groupeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Groupe',
      default: null,
    },
    eleveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    dateEcheance: { type: Date, default: null },
    creePar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Affectation = mongoose.model('Affectation', affectationSchema);
export default Affectation;
