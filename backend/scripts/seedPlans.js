import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Plan from '../models/planModel.js';
import Niveau from '../models/niveauModel.js';

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB Connected\n');

  const niveaux = await Niveau.find({}).sort({ ordre: 1 });
  if (!niveaux.length) {
    console.error('❌ Aucun niveau trouvé. Lance seedNiveaux.js d\'abord.');
    process.exit(1);
  }

  const find = (nom) => niveaux.find(n => n.nom === nom);

  const plans = [
    // ── Collège ──
    { nom: 'Collège 7ème', niveauId: find('7ème')?._id, prix: 45, dureeEngagement: 1, description: 'Cours de mathématiques et initiation Python — 7ème' },
    { nom: 'Collège 8ème', niveauId: find('8ème')?._id, prix: 45, dureeEngagement: 1, description: 'Cours de mathématiques et Python — 8ème' },
    { nom: 'Collège 9ème', niveauId: find('9ème')?._id, prix: 45, dureeEngagement: 1, description: 'Cours de mathématiques et Python — 9ème' },
    { nom: 'Collège 6ème (FR)', niveauId: find('6ème')?._id, prix: 45, dureeEngagement: 1, description: 'Cours mathématiques et Python — système français' },
    { nom: 'Collège 5ème (FR)', niveauId: find('5ème')?._id, prix: 45, dureeEngagement: 1, description: 'Cours mathématiques et Python — système français' },
    { nom: 'Collège 4ème (FR)', niveauId: find('4ème')?._id, prix: 45, dureeEngagement: 1, description: 'Cours mathématiques et Python — système français' },
    { nom: 'Collège 3ème (FR)', niveauId: find('3ème')?._id, prix: 45, dureeEngagement: 1, description: 'Cours mathématiques et Python — système français' },

    // ── Lycée Tunisien ──
    { nom: '1ère Lycée', niveauId: find('1ère lycée')?._id, prix: 60, dureeEngagement: 1, description: 'Mathématiques + Python appliqué — 1ère lycée' },
    { nom: '2ème Lycée', niveauId: find('2ème lycée')?._id, prix: 60, dureeEngagement: 1, description: 'Mathématiques + Python appliqué — 2ème lycée' },
    { nom: '3ème Lycée', niveauId: find('3ème lycée')?._id, prix: 70, dureeEngagement: 1, description: 'Mathématiques avancées + Python — 3ème lycée' },
    { nom: '4ème Lycée BAC', niveauId: find('4ème lycée — BAC')?._id, prix: 80, dureeEngagement: 1, description: 'Préparation BAC — Mathématiques & Python' },

    // ── Lycée Français ──
    { nom: 'Seconde (FR)', niveauId: find('2nde')?._id, prix: 60, dureeEngagement: 1, description: 'Mathématiques + Python — Seconde' },
    { nom: 'Première (FR)', niveauId: find('1ère')?._id, prix: 70, dureeEngagement: 1, description: 'Mathématiques + Python — Première' },
    { nom: 'Terminale (FR)', niveauId: find('Terminale')?._id, prix: 80, dureeEngagement: 1, description: 'Préparation BAC Terminale — Mathématiques & Python' },

    // ── Université ──
    { nom: 'Développement Web', niveauId: find('Développement Web')?._id, prix: 150, dureeEngagement: 1, description: 'Formation complète fullstack HTML/CSS/JS/React/Node' },
    { nom: 'Développement Mobile', niveauId: find('Développement Mobile')?._id, prix: 150, dureeEngagement: 1, description: 'Formation iOS/Android React Native & Flutter' },
    { nom: 'Intelligence Artificielle', niveauId: find('Intelligence Artificielle')?._id, prix: 180, dureeEngagement: 1, description: 'Machine Learning, Deep Learning, Python IA' },
    { nom: 'Blockchain', niveauId: find('Blockchain')?._id, prix: 180, dureeEngagement: 1, description: 'Smart contracts, Solidity, Web3 & DeFi' },
  ].filter(p => p.niveauId); // ignore les niveaux non trouvés

  await Plan.deleteMany({});
  const created = await Plan.insertMany(plans);

  console.log(`✅ ${created.length} plans tarifaires créés :\n`);
  created.forEach(p => console.log(`  ${p.nom} — ${p.prix} TND/mois`));

  process.exit(0);
};

seed().catch(err => {
  console.error('Erreur seed plans:', err.message);
  process.exit(1);
});
