import mongoose from 'mongoose';

const exerciceSchema = new mongoose.Schema(
  {
    chapitreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapitre',
      required: true,
    },
    // math ou python
    type_partie: {
      type: String,
      enum: ['math', 'python'],
      required: true,
    },
    // Type d'exercice
    type: {
      type: String,
      enum: ['qcm', 'completion', 'projet_libre'],
      required: true,
    },
    enonce: { type: String, required: true },
    // Pour QCM
    options: [{ type: String }],
    // Pour auto-correction (qcm + completion)
    reponseAttendue: { type: String },
    // Pour code Python : le code de départ
    codeStarter: { type: String },
    // Validation automatique ou par le prof
    validation: {
      type: String,
      enum: ['auto', 'prof'],
      default: 'auto',
    },
    scoreMax: { type: Number, default: 10 },
    ordre: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Exercice = mongoose.model('Exercice', exerciceSchema);
export default Exercice;
