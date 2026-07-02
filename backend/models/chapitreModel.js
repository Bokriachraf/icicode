import mongoose from 'mongoose';

const chapitreSchema = new mongoose.Schema(
  {
    niveauId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Niveau',
      required: true,
    },
    titre: { type: String, required: true },
    // Ordre dans le curriculum du niveau
    ordre: { type: Number, required: true },
    description: { type: String },

    // Partie mathématique
    math: {
      contenu: { type: String },        // Markdown ou HTML
      videoUrl: { type: String },       // URL replay séance
      fichierPdf: { type: String },     // URL PDF du cours
      exercices: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Exercice' },
      ],
    },

    // Partie Python liée
    python: {
      codeStarter: { type: String, default: '# Écris ton code Python ici\n' },
      consignes: { type: String },
      exercices: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Exercice' },
      ],
      // La partie Python se déverrouille après Math ou immédiatement
      debloquéApres: {
        type: String,
        enum: ['math', 'immediat'],
        default: 'math',
      },
    },

    actif: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Chapitre = mongoose.model('Chapitre', chapitreSchema);
export default Chapitre;
