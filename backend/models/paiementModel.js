import mongoose from 'mongoose';

const paiementSchema = new mongoose.Schema(
  {
    abonnementId: { type: mongoose.Schema.Types.ObjectId, ref: 'Abonnement', required: true },
    eleveId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    montant:      { type: Number, required: true },
    statut: {
      type: String,
      enum: ['en_attente', 'payé', 'échoué', 'remboursé'],
      default: 'en_attente',
    },
    methode: {
      type: String,
      enum: ['flouci', 'virement', 'especes'],
      default: 'flouci',
    },
    flouciPaymentId: { type: String, default: null },
    periode: {
      debut: { type: Date },
      fin:   { type: Date },
    },
    recu: { type: String, default: null },
    note: { type: String, default: null }, // note admin
  },
  { timestamps: true }
);

const Paiement = mongoose.model('Paiement', paiementSchema);
export default Paiement;
