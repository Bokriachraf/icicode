import mongoose from 'mongoose';

const progressionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    chapitreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapitre',
      required: true,
    },
    // Statut de la partie Math
    mathStatus: {
      type: String,
      enum: ['non_commencé', 'en_cours', 'terminé'],
      default: 'non_commencé',
    },
    // Statut de la partie Python
    pythonStatus: {
      type: String,
      enum: ['verrouillé', 'en_cours', 'terminé'],
      default: 'verrouillé',
    },
    // Exercices rendus
    exercicesRendus: [
      {
        exerciceId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Exercice',
        },
        reponse: { type: String },    // Réponse ou code soumis
        score: { type: Number, default: 0 },
        validePar: { type: String, enum: ['auto', 'prof'], default: 'auto' },
        commentaireProf: { type: String },
        soumisA: { type: Date, default: Date.now },
        statut: {
          type: String,
          enum: ['en_attente', 'validé', 'refusé'],
          default: 'en_attente',
        },
      },
    ],
    scoreTotal: { type: Number, default: 0 },
    // Dates
    debutMathA: { type: Date },
    finMathA: { type: Date },
    debutPythonA: { type: Date },
    finPythonA: { type: Date },
  },
  { timestamps: true }
);

// Index pour éviter les doublons userId + chapitreId
progressionSchema.index({ userId: 1, chapitreId: 1 }, { unique: true });

const Progression = mongoose.model('Progression', progressionSchema);
export default Progression;
