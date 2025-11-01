import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false},
    isInscriptionComplete: { type: Boolean, default: false },

      progression: [
      {
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }, // Cours suivi
        status: {
          type: String,
          enum: ['non commencé', 'en cours', 'terminé'],
          default: 'non commencé',
        },
        score: { type: Number, default: 0 }, // ex: quiz, exercices
      },
    ],
    role: { type: String, enum: ['etudiant', 'admin'], default: 'etudiant' },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model('User', userSchema);
export default User;
