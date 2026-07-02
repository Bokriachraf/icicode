import mongoose from 'mongoose';

const seanceSchema = new mongoose.Schema(
  {
    chapitreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapitre',
      required: true,
    },
    niveauId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Niveau',
      required: true,
    },
    titre: { type: String, required: true },
    dateHeure: { type: Date, required: true },
    duree: { type: Number, default: 60 }, // minutes
    // LiveKit room
    roomId: { type: String, unique: true, sparse: true },
    roomToken: { type: String }, // token LiveKit généré à la demande
    statut: {
      type: String,
      enum: ['planifiée', 'en_cours', 'terminée', 'annulée'],
      default: 'planifiée',
    },
    // URL de l'enregistrement après la séance
    replayUrl: { type: String },
    // Participants présents
    participants: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rejointA: { type: Date },
        quittéA: { type: Date },
      },
    ],
    notes: { type: String }, // Notes du prof après la séance
  },
  { timestamps: true }
);

const Seance = mongoose.model('Seance', seanceSchema);
export default Seance;
