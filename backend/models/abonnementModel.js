import mongoose from 'mongoose';

const abonnementSchema = new mongoose.Schema(
  {
    eleveId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    planId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
    prixPersonnalise: { type: Number, default: null },
    dateDebut:    { type: Date, required: true },
    dateEcheance: { type: Date, required: true },
    statut: {
      type: String,
      enum: ['actif', 'suspendu', 'expiré', 'gratuit'],
      default: 'suspendu',
    },
    methodePaiement: {
      type: String,
      enum: ['flouci', 'virement', 'especes', 'gratuit'],
      default: 'flouci',
    },
  },
  { timestamps: true }
);

const Abonnement = mongoose.model('Abonnement', abonnementSchema);
export default Abonnement;
