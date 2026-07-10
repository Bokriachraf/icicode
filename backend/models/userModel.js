import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },

    /*
      password optionnel pour les comptes Google OAuth.
      La règle : required seulement si le provider est 'local'.
    */
    password: {
      type: String,
      default: null,
      required: function () {
        return this.provider === 'local';
      },
    },

    /* Provider d'authentification */
    provider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },

    googleId: { type: String, default: null },

    isAdmin: { type: Boolean, default: false },
    isInscriptionComplete: { type: Boolean, default: false },

    progression: [
      {
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        status: {
          type: String,
          enum: ['non commencé', 'en cours', 'terminé'],
          default: 'non commencé',
        },
        score: { type: Number, default: 0 },
      },
    ],

    role: {
      type: String,
      enum: ['etudiant', 'admin', 'prof'],
      default: 'etudiant',
    },

    niveauId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Niveau',
      default: null,
    },

    /* Champs profil complémentaires */
    nom:    { type: String, default: null },
    prenom: { type: String, default: null },
    tel:    { type: String, default: null },
    sourceDecouverte:  { type: String, default: null },
    newsletterConsent: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
export default User;
