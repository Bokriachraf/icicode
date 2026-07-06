/**
 * seed:exercices-suites — Crée 4 exercices (2 math + 2 python), un par
 * chapitre de "Suites réelles" (Parties 1 à 4), avec tous les champs du
 * formulaire /admin/exercices/create.
 *
 * Le chapitreId de chaque partie est déduit automatiquement en cherchant
 * les chapitres dont le titre commence par "Suites réelles — Partie".
 * (Ils doivent déjà exister — lancer d'abord seedChapitresSuites.js.)
 *
 * Idempotent : upsert sur {chapitreId, enonce}.
 *
 * Usage :
 *   cd backend
 *   node scripts/seedExercicesSuites.js
 */

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '..', '.env') })

import Chapitre from '../models/chapitreModel.js'
import Exercice from '../models/exerciceModel.js'

// ─────────────────────────────────────────────
// Un exercice par partie — ordre = ordre du chapitre correspondant (1 à 4)
// 2 en math (Partie 1 et 2), 2 en python (Partie 3 et 4)
// ─────────────────────────────────────────────
const exercicesParOrdreChapitre = {
  1: {
    // Partie 1 : Généralités — QCM math
    type_partie: 'math',
    type: 'qcm',
    enonce:
      "Une suite définie par u0 = 1 et u(n+1) = 3·un − 2 est une suite définie de quelle façon ?",
    options: [
      'De façon explicite (un = f(n))',
      'Par récurrence (u(n+1) = f(un))',
      "Elle n'est pas définie",
      'De façon géométrique uniquement',
    ],
    reponseAttendue: 'Par récurrence (u(n+1) = f(un))',
    codeStarter: '',
    validation: 'auto',
    scoreMax: 5,
    ordre: 1,
  },
  2: {
    // Partie 2 : Sens de variation — Complétion math
    type_partie: 'math',
    type: 'completion',
    enonce:
      "Soit (un) définie par un = n² + 1. Calcule le signe de un+1 − un pour tout n ≥ 0, " +
      "et complète : la suite (un) est ______ sur ℕ.",
    options: [],
    reponseAttendue: 'croissante',
    codeStarter: '',
    validation: 'auto',
    scoreMax: 5,
    ordre: 1,
  },
  3: {
    // Partie 3 : Arithmétique / Géométrique — Projet libre python
    type_partie: 'python',
    type: 'projet_libre',
    enonce:
      "Écris un programme Python qui calcule et affiche les 10 premiers termes d'une suite " +
      "arithmétique de premier terme u0 = 2 et de raison r = 3, puis fais de même pour une suite " +
      "géométrique de premier terme u0 = 1 et de raison q = 2. Affiche également la somme des " +
      "10 premiers termes de chaque suite.",
    options: [],
    reponseAttendue: '',
    codeStarter:
      "def arithmetique(u0, r, n):\n" +
      "    return u0 + n * r\n\n" +
      "def geometrique(u0, q, n):\n" +
      "    return u0 * (q ** n)\n\n" +
      "# TODO : afficher les 10 premiers termes de chaque suite\n" +
      "# TODO : calculer et afficher la somme des 10 premiers termes de chaque suite\n",
    validation: 'prof',
    scoreMax: 10,
    ordre: 1,
  },
  4: {
    // Partie 4 : Limites — Projet libre python
    type_partie: 'python',
    type: 'projet_libre',
    enonce:
      "Écris un programme Python qui affiche les 20 premiers termes de la suite u(n) = 1/n " +
      "(n ≥ 1) et observe numériquement si la suite semble converger. Fais de même avec la suite " +
      "v(n) = n pour observer une suite divergente. Conclus en commentaire dans ton code.",
    options: [],
    reponseAttendue: '',
    codeStarter:
      "def u(n):\n" +
      "    return 1 / n\n\n" +
      "def v(n):\n" +
      "    return n\n\n" +
      "# TODO : afficher u(n) pour n de 1 à 20 et observer la convergence\n" +
      "# TODO : afficher v(n) pour n de 1 à 20 et observer la divergence\n",
    validation: 'prof',
    scoreMax: 10,
    ordre: 1,
  },
}

const run = async () => {
  if (!process.env.MONGO_URI) {
    console.error('❌  MONGO_URI manquant dans backend/.env')
    process.exit(1)
  }

  await mongoose.connect(process.env.MONGO_URI)
  console.log(`✅  MongoDB connecté : ${mongoose.connection.host}\n`)

  const chapitres = await Chapitre.find({ titre: /^Suites réelles — Partie/ }).sort({ ordre: 1 })

  if (chapitres.length !== 4) {
    console.error(
      `❌  ${chapitres.length} chapitre(s) "Suites réelles — Partie X" trouvé(s) au lieu de 4.`
    )
    console.error('    Lance d\'abord : node scripts/seedChapitresSuites.js')
    process.exit(1)
  }

  const results = []
  for (const chapitre of chapitres) {
    const template = exercicesParOrdreChapitre[chapitre.ordre]
    if (!template) {
      console.warn(`⚠️  Pas de template d'exercice pour l'ordre ${chapitre.ordre}, ignoré.`)
      continue
    }

    const doc = await Exercice.findOneAndUpdate(
      { chapitreId: chapitre._id, enonce: template.enonce },
      {
        $set: {
          chapitreId: chapitre._id,
          type_partie: template.type_partie,
          type: template.type,
          enonce: template.enonce,
          options: template.options,
          reponseAttendue: template.reponseAttendue,
          codeStarter: template.codeStarter,
          validation: template.validation,
          scoreMax: template.scoreMax,
          ordre: template.ordre,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )
    results.push({ chapitreTitre: chapitre.titre, exercice: doc })
  }

  // ── Résumé ──────────────────────────────
  console.log('┌───────────────────────────────────────────┬─────────┬──────────────┐')
  console.log('│ Chapitre                                   │ Partie  │ Type         │')
  console.log('├───────────────────────────────────────────┼─────────┼──────────────┤')
  for (const r of results) {
    const partie = r.exercice.type_partie.padEnd(7)
    const type = r.exercice.type.padEnd(12)
    console.log(`│ ${r.chapitreTitre.padEnd(43)} │ ${partie} │ ${type} │`)
  }
  console.log('└───────────────────────────────────────────┴─────────┴──────────────┘')

  const nbMath = results.filter(r => r.exercice.type_partie === 'math').length
  const nbPython = results.filter(r => r.exercice.type_partie === 'python').length
  console.log(`\n✅  ${results.length} exercices créés/mis à jour (${nbMath} math, ${nbPython} python).`)

  process.exit(0)
}

run().catch((err) => {
  console.error('❌  Erreur seed :', err.message)
  process.exit(1)
})
