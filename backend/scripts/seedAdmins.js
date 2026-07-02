/**
 * seed:admins — Crée ou met à jour les comptes admin et prof en base
 *
 * Usage :
 *   cd backend
 *   npm run seed:admins
 *
 * Le script est idempotent : on peut le relancer sans risque.
 * Si les emails existent déjà, il met à jour le rôle/isAdmin/password.
 */

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Résoudre __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Charger le .env du dossier parent (backend/.env)
dotenv.config({ path: join(__dirname, '..', '.env') })

// Import du modèle APRÈS dotenv.config()
import User from '../models/userModel.js'

// ─────────────────────────────────────────────
// Comptes à créer / synchroniser
// ─────────────────────────────────────────────
const seeds = [
  {
    name: 'Admin Général',
    email: 'admin@codalog.tn',
    password: 'Admin@2025!',       // ← change après le 1er login
    isAdmin: true,
    role: 'admin',
    isInscriptionComplete: true,
  },
  {
    name: 'Prof Codalog',
    email: 'prof@codalog.tn',
    password: 'Prof@2025!',        // ← change après le 1er login
    isAdmin: true,                  // isAdmin: true pour accéder à /admin/*
    role: 'prof',
    isInscriptionComplete: true,
  },
]

// ─────────────────────────────────────────────
const SALT = 10

const run = async () => {
  if (!process.env.MONGO_URI) {
    console.error('❌  MONGO_URI manquant dans le .env')
    process.exit(1)
  }

  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log(`✅  MongoDB connecté : ${mongoose.connection.host}\n`)

    const results = []

    for (const seed of seeds) {
      const existing = await User.findOne({ email: seed.email })

      if (existing) {
        // Mise à jour — on ne réhache le mot de passe que si différent
        existing.name                = seed.name
        existing.isAdmin             = seed.isAdmin
        existing.role                = seed.role
        existing.isInscriptionComplete = seed.isInscriptionComplete
        existing.password            = bcrypt.hashSync(seed.password, SALT)

        await existing.save()
        results.push({ action: 'MàJ', ...seed })
      } else {
        await User.create({
          name:                 seed.name,
          email:                seed.email,
          password:             bcrypt.hashSync(seed.password, SALT),
          isAdmin:              seed.isAdmin,
          role:                 seed.role,
          isInscriptionComplete: seed.isInscriptionComplete,
        })
        results.push({ action: 'Créé', ...seed })
      }
    }

    // ── Résumé ──────────────────────────────
    console.log('┌─────────────────────────────────────────────────────────┐')
    console.log('│              SEED ADMINS — RÉSULTAT                    │')
    console.log('├───────────┬──────────────────────┬───────────┬─────────┤')
    console.log('│  Action   │  Email               │  Rôle     │  mdp    │')
    console.log('├───────────┼──────────────────────┼───────────┼─────────┤')
    for (const r of results) {
      const action = r.action.padEnd(9)
      const email  = r.email.padEnd(20)
      const role   = r.role.padEnd(9)
      const pwd    = r.password.padEnd(7)
      console.log(`│  ${action}│  ${email}│  ${role}│  ${pwd}│`)
    }
    console.log('└───────────┴──────────────────────┴───────────┴─────────┘')
    console.log('\n⚠️  Changez les mots de passe après le premier login !')
    console.log('   Admin : http://localhost:3000/admin')

    process.exit(0)
  } catch (err) {
    console.error('❌  Erreur seed :', err.message)
    process.exit(1)
  }
}

run()
