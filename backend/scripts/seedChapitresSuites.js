/**
 * seed:chapitres-suites — Insère les 4 chapitres du chapitre "Suites réelles"
 * directement en base (équivalent au formulaire /admin/chapitres/create,
 * même schéma, mêmes champs).
 *
 * Le niveau (niveauId) est déduit automatiquement : le script cherche le
 * chapitre "Suites" déjà créé via le formulaire et réutilise son niveauId.
 * Si tu veux forcer un niveau précis, mets son nom exact dans NIVEAU_NOM
 * ci-dessous (ex: "4ème lycée — BAC", "Terminale", "1ère", ...).
 *
 * Le script est idempotent (upsert sur niveauId + ordre) : on peut le
 * relancer sans créer de doublons.
 *
 * Usage :
 *   cd backend
 *   node scripts/seedChapitresSuites.js
 */

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '..', '.env') })

import Niveau from '../models/niveauModel.js'
import Chapitre from '../models/chapitreModel.js'

// ─────────────────────────────────────────────
// Si tu veux forcer un niveau précis, mets son nom ici (sinon laisse null
// et le script réutilisera le niveau du 1er chapitre "Suites" trouvé).
// ─────────────────────────────────────────────
const NIVEAU_NOM = null // ex: "4ème lycée — BAC"

// ─────────────────────────────────────────────
// Les 4 parties de "Suites réelles" — mêmes champs que le formulaire
// (infos générales + partie math + partie python)
// ─────────────────────────────────────────────
const parties = [
  {
    ordre: 1,
    titre: 'Suites réelles — Partie 1 : Généralités',
    description: "Définition d'une suite, modes de génération (explicite / récurrent) et représentation graphique.",
    math: {
      contenu:
        "Une suite réelle est une fonction définie sur ℕ (ou une partie de ℕ) à valeurs dans ℝ. " +
        "On note un le terme de rang n. Une suite peut être définie de façon explicite (un = f(n)) " +
        "ou par récurrence (u0 donné et u(n+1) = f(un)). On étudie ici la représentation des premiers " +
        "termes sur un axe et l'interprétation graphique du mode de génération.",
      videoUrl: '',
      fichierPdf: '',
    },
    python: {
      codeStarter:
        "# Partie 1 : Générer les termes d'une suite\n\n" +
        "def suite_explicite(n):\n" +
        "    # Exemple : u(n) = 2*n + 1\n" +
        "    return 2 * n + 1\n\n" +
        "for n in range(10):\n" +
        "    print(f\"u({n}) =\", suite_explicite(n))\n",
      consignes:
        "Complète la fonction suite_explicite pour qu'elle calcule le terme de rang n, " +
        "puis écris une fonction suite_recurrente(u0, n, f) qui renvoie le n-ième terme " +
        "d'une suite définie par récurrence.",
      debloquéApres: 'math',
    },
  },
  {
    ordre: 2,
    titre: 'Suites réelles — Partie 2 : Sens de variation',
    description: "Étude de la monotonie d'une suite (croissante, décroissante, constante) et méthodes pour l'établir.",
    math: {
      contenu:
        "Une suite (un) est croissante si un+1 ≥ un pour tout n, décroissante si un+1 ≤ un pour tout n. " +
        "Pour étudier le sens de variation, on peut étudier le signe de un+1 − un, comparer un+1/un à 1 " +
        "(si un > 0), ou étudier les variations de la fonction f associée dans le cas explicite.",
      videoUrl: '',
      fichierPdf: '',
    },
    python: {
      codeStarter:
        "# Partie 2 : Étudier le sens de variation\n\n" +
        "def etudier_variation(u, n_max):\n" +
        "    termes = [u(n) for n in range(n_max)]\n" +
        "    for i in range(len(termes) - 1):\n" +
        "        diff = termes[i+1] - termes[i]\n" +
        "        print(f\"u({i+1}) - u({i}) =\", diff)\n" +
        "    return termes\n",
      consignes:
        "Utilise etudier_variation pour afficher le signe de un+1 - un sur les 10 premiers termes " +
        "et conclure sur la monotonie de la suite. Trace ensuite le nuage de points avec matplotlib.",
      debloquéApres: 'math',
    },
  },
  {
    ordre: 3,
    titre: 'Suites réelles — Partie 3 : Suites arithmétiques et géométriques',
    description: 'Définitions, formules explicites, somme des termes, pour les suites arithmétiques et géométriques.',
    math: {
      contenu:
        "Suite arithmétique de raison r : un+1 = un + r, terme général un = u0 + n·r, " +
        "somme des n+1 premiers termes = (n+1)(u0 + un)/2. " +
        "Suite géométrique de raison q : un+1 = un × q, terme général un = u0 × q^n, " +
        "somme des n+1 premiers termes = u0 × (1 − q^(n+1))/(1 − q) si q ≠ 1.",
      videoUrl: '',
      fichierPdf: '',
    },
    python: {
      codeStarter:
        "# Partie 3 : Suites arithmétiques et géométriques\n\n" +
        "def arithmetique(u0, r, n):\n" +
        "    return u0 + n * r\n\n" +
        "def geometrique(u0, q, n):\n" +
        "    return u0 * (q ** n)\n",
      consignes:
        "Complète les deux fonctions, puis écris une fonction somme_arithmetique(u0, r, n) et " +
        "somme_geometrique(u0, q, n) qui calculent la somme des n+1 premiers termes.",
      debloquéApres: 'math',
    },
  },
  {
    ordre: 4,
    titre: 'Suites réelles — Partie 4 : Limites de suites',
    description: "Convergence, divergence, suites majorées/minorées/bornées et théorèmes de convergence.",
    math: {
      contenu:
        "Une suite (un) converge vers L si un se rapproche de L quand n tend vers +∞. " +
        "Une suite est majorée s'il existe M tel que un ≤ M pour tout n, minorée s'il existe m " +
        "tel que un ≥ m pour tout n, bornée si elle est à la fois majorée et minorée. " +
        "Théorème : toute suite croissante et majorée converge (idem décroissante et minorée).",
      videoUrl: '',
      fichierPdf: '',
    },
    python: {
      codeStarter:
        "# Partie 4 : Étudier la convergence numériquement\n\n" +
        "def approcher_limite(u, n_max):\n" +
        "    for n in range(n_max):\n" +
        "        print(f\"u({n}) =\", u(n))\n",
      consignes:
        "Utilise approcher_limite sur une suite convergente (ex: u(n) = 1/n) et une suite divergente " +
        "(ex: u(n) = n) pour observer numériquement la différence de comportement.",
      debloquéApres: 'math',
    },
  },
]

const run = async () => {
  if (!process.env.MONGO_URI) {
    console.error('❌  MONGO_URI manquant dans backend/.env')
    process.exit(1)
  }

  await mongoose.connect(process.env.MONGO_URI)
  console.log(`✅  MongoDB connecté : ${mongoose.connection.host}\n`)

  // 1) Déterminer le niveauId à utiliser
  let niveauId = null
  let niveauNom = null

  if (NIVEAU_NOM) {
    const niveau = await Niveau.findOne({ nom: NIVEAU_NOM })
    if (!niveau) {
      console.error(`❌  Niveau "${NIVEAU_NOM}" introuvable. Vérifie le nom exact (voir seedNiveaux.js).`)
      process.exit(1)
    }
    niveauId = niveau._id
    niveauNom = niveau.nom
  } else {
    const existant = await Chapitre.findOne({ titre: /suite/i }).populate('niveauId', 'nom')
    if (!existant) {
      console.error('❌  Aucun chapitre "Suites" existant trouvé pour déduire le niveau.')
      console.error('    Renseigne NIVEAU_NOM en haut du script puis relance.')
      process.exit(1)
    }
    niveauId = existant.niveauId._id
    niveauNom = existant.niveauId.nom
  }

  console.log(`📘  Niveau ciblé : ${niveauNom} (${niveauId})\n`)

  // 2) Upsert des 4 chapitres
  const results = []
  for (const partie of parties) {
    const doc = await Chapitre.findOneAndUpdate(
      { niveauId, titre: partie.titre },
      {
        $set: {
          niveauId,
          titre: partie.titre,
          ordre: partie.ordre,
          description: partie.description,
          math: partie.math,
          python: partie.python,
          actif: true,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )
    results.push(doc)
  }

  // ── Résumé ──────────────────────────────
  console.log('┌───────┬──────────────────────────────────────────────────────┐')
  console.log('│ Ordre │ Titre                                                │')
  console.log('├───────┼──────────────────────────────────────────────────────┤')
  for (const r of results) {
    console.log(`│  ${String(r.ordre).padEnd(4)} │ ${r.titre.padEnd(53)}│`)
  }
  console.log('└───────┴──────────────────────────────────────────────────────┘')
  console.log(`\n✅  ${results.length} chapitres créés/mis à jour pour le niveau "${niveauNom}".`)
  console.log('\n⚠️  L\'ancien chapitre "Suites" (créé via le formulaire) existe toujours en base.')
  console.log('    Vérifie la séance déjà créée : son chapitreId pointe peut-être encore vers l\'ancien')
  console.log('    chapitre unique. Mets-la à jour manuellement (ou via /admin/seances) pour pointer')
  console.log('    vers "Suites réelles — Partie 1" si besoin, avant de désactiver/supprimer l\'ancien.')

  process.exit(0)
}

run().catch((err) => {
  console.error('❌  Erreur seed :', err.message)
  process.exit(1)
})
