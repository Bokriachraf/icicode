import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Niveau from '../models/niveauModel.js';

dotenv.config();

const niveaux = [
  // ── Collège Tunisien ──
  { nom: '7ème', categorie: 'college', systeme: 'tunisien', ordre: 1, description: '1ère année collège — système tunisien' },
  { nom: '8ème', categorie: 'college', systeme: 'tunisien', ordre: 2, description: '2ème année collège — système tunisien' },
  { nom: '9ème', categorie: 'college', systeme: 'tunisien', ordre: 3, description: '3ème année collège — système tunisien' },

  // ── Collège Français ──
  { nom: '6ème', categorie: 'college', systeme: 'francais', ordre: 4, description: '1ère année collège — système français' },
  { nom: '5ème', categorie: 'college', systeme: 'francais', ordre: 5, description: '2ème année collège — système français' },
  { nom: '4ème', categorie: 'college', systeme: 'francais', ordre: 6, description: '3ème année collège — système français' },
  { nom: '3ème', categorie: 'college', systeme: 'francais', ordre: 7, description: '4ème année collège — système français' },

  // ── Lycée Tunisien ──
  { nom: '1ère lycée', categorie: 'lycee', systeme: 'tunisien', ordre: 8, description: '1ère année lycée — système tunisien' },
  { nom: '2ème lycée', categorie: 'lycee', systeme: 'tunisien', ordre: 9, description: '2ème année lycée — système tunisien' },
  { nom: '3ème lycée', categorie: 'lycee', systeme: 'tunisien', ordre: 10, description: '3ème année lycée — système tunisien' },
  { nom: '4ème lycée — BAC', categorie: 'lycee', systeme: 'tunisien', ordre: 11, description: 'Année du Baccalauréat — système tunisien' },

  // ── Lycée Français ──
  { nom: '2nde', categorie: 'lycee', systeme: 'francais', ordre: 12, description: 'Seconde — système français' },
  { nom: '1ère', categorie: 'lycee', systeme: 'francais', ordre: 13, description: 'Première — système français' },
  { nom: 'Terminale', categorie: 'lycee', systeme: 'francais', ordre: 14, description: 'Terminale BAC — système français' },

  // ── Université ──
  { nom: 'Développement Web', categorie: 'universite', systeme: 'universite', ordre: 15, description: 'Formation développement web fullstack' },
  { nom: 'Développement Mobile', categorie: 'universite', systeme: 'universite', ordre: 16, description: 'Formation développement mobile iOS/Android' },
  { nom: 'Intelligence Artificielle', categorie: 'universite', systeme: 'universite', ordre: 17, description: 'Formation IA, Machine Learning, Deep Learning' },
  { nom: 'Blockchain', categorie: 'universite', systeme: 'universite', ordre: 18, description: 'Formation Blockchain et technologies décentralisées' },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    await Niveau.deleteMany({});
    console.log('Niveaux existants supprimés');

    const created = await Niveau.insertMany(niveaux);
    console.log(`✅ ${created.length} niveaux insérés :\n`);

    const categories = ['college', 'lycee', 'universite'];
    categories.forEach(cat => {
      console.log(`\n── ${cat.toUpperCase()} ──`);
      created
        .filter(n => n.categorie === cat)
        .forEach(n => console.log(`  ${n.ordre}. ${n.nom} (${n.systeme})`));
    });

    process.exit(0);
  } catch (err) {
    console.error('Erreur seed:', err.message);
    process.exit(1);
  }
};

seed();
