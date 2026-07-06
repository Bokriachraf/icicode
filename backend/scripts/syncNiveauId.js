/**
 * Script de migration : synchronise niveauId depuis Inscription → User
 * Pour les élèves qui se sont inscrits avant le fix de Step3.js
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Inscription from '../models/inscriptionModel.js';
import User from '../models/userModel.js';

dotenv.config();

const migrate = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB Connected\n');

  // Récupère toutes les inscriptions validées avec un niveauId
  const inscriptions = await Inscription.find({
    status: { $in: ['Validé', 'En attente', 'En cours'] },
    niveauId: { $ne: null },
  });

  console.log(`${inscriptions.length} inscriptions trouvées avec niveauId\n`);

  let updated = 0;
  let skipped = 0;

  for (const insc of inscriptions) {
    const user = await User.findById(insc.user);
    if (!user) { skipped++; continue; }

    if (!user.niveauId) {
      user.niveauId = insc.niveauId;
      user.isInscriptionComplete = true;
      await user.save();
      console.log(`✅ ${user.name} (${user.email}) → niveauId: ${insc.niveauId}`);
      updated++;
    } else {
      console.log(`⏭  ${user.name} — niveauId déjà présent`);
      skipped++;
    }
  }

  console.log(`\n── Résumé ──`);
  console.log(`✅ Mis à jour : ${updated}`);
  console.log(`⏭  Ignorés   : ${skipped}`);

  process.exit(0);
};

migrate().catch(err => {
  console.error('Erreur migration:', err.message);
  process.exit(1);
});
