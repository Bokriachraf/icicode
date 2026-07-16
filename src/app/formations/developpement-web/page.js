'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'

const PROGRAMME = [
  {
    niveau: '⚡ Fondations',
    points: [
      'HTML5 sémantique — structurer une page web correctement',
      'CSS3 moderne — Flexbox, Grid, animations',
      'JavaScript ES6+ — variables, fonctions, DOM, événements',
      'Git & GitHub — versionner et collaborer sur son code',
    ],
  },
  {
    niveau: '⚛️ Frontend Avancé',
    points: [
      'React.js — composants, props, state, hooks',
      'Next.js — routing, SSR, SSG, déploiement Vercel',
      'Tailwind CSS — design system rapide et responsive',
      'Redux — gestion d\'état globale pour applications complexes',
    ],
  },
  {
    niveau: '🛠️ Backend & Fullstack',
    points: [
      'Node.js & Express — API REST sécurisée',
      'MongoDB & Mongoose — base de données NoSQL',
      'Authentification JWT — login, register, routes protégées',
      'Déploiement Render + Vercel — mise en production réelle',
    ],
  },
]

const COMPETENCES = [
  'Créer une interface web responsive de A à Z',
  'Construire une API REST complète avec Node.js et Express',
  'Connecter un frontend React à un backend Node',
  'Gérer une base de données MongoDB en production',
  'Déployer une application fullstack sur le web',
  'Versionner et collaborer sur un projet avec Git',
]

const FAQ = [
  {
    q: 'Faut-il des bases en programmation ?',
    r: 'Non. La formation commence par les absolus fondamentaux du web — HTML, CSS, puis JavaScript. Tu n\'as besoin de rien connaître au départ.',
  },
  {
    q: 'Combien de temps dure la formation ?',
    r: 'La formation est découpée en chapitres progressifs. À raison d\'une séance par semaine, tu seras fullstack en 6 à 9 mois.',
  },
  {
    q: 'On construit des vrais projets ?',
    r: 'Oui. Chaque module se termine par un mini-projet réel : landing page, application React, API Express, application fullstack complète.',
  },
  {
    q: 'Quelle différence avec les tutoriels YouTube ?',
    r: 'Ici tu as un prof qui suit ta progression, corrige ton code, répond à tes questions en live, et te guide sur un parcours cohérent.',
  },
]

// ── Visualisation : anatomie d'une page web ──────────────────────────────────
function AnatomieWeb() {
  const blocs = [
    { label: '<header>', color: 'rgba(0,255,209,0.15)', border: 'rgba(0,255,209,0.4)', h: 36 },
    { label: '<nav>', color: 'rgba(0,170,255,0.1)', border: 'rgba(0,170,255,0.3)', h: 28 },
    { label: '<main>', color: 'rgba(255,200,60,0.08)', border: 'rgba(255,200,60,0.25)', h: 80 },
    { label: '<section>', color: 'rgba(0,255,209,0.06)', border: 'rgba(0,255,209,0.2)', h: 52 },
    { label: '<footer>', color: 'rgba(168,200,230,0.06)', border: 'rgba(168,200,230,0.2)', h: 28 },
  ]
  return (
    <svg viewBox="0 0 320 280" className="w-full h-auto">
      {blocs.reduce((acc, b, i) => {
        const y = acc.y
        acc.elements.push(
          <g key={b.label}>
            <rect x="20" y={y} width="280" height={b.h} rx="6"
              fill={b.color} stroke={b.border} strokeWidth="1" />
            <text x="32" y={y + b.h / 2 + 4} fontSize="11"
              fill="rgba(255,255,255,0.7)" fontFamily="monospace">{b.label}</text>
          </g>
        )
        acc.y += b.h + 6
        return acc
      }, { y: 14, elements: [] }).elements}
    </svg>
  )
}

// ── Visualisation : flux requête HTTP ────────────────────────────────────────
function FluxHTTP() {
  const W = 420, H = 160
  const nodes = [
    { x: 50,  y: 80, label: 'Navigateur', icon: '🌐' },
    { x: 210, y: 80, label: 'Serveur',    icon: '⚙️' },
    { x: 370, y: 80, label: 'Base de données', icon: '🗄️' },
  ]
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
      {/* Flèches */}
      <defs>
        <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M1 1L9 5L1 9" fill="none" stroke="rgba(0,255,209,0.6)" strokeWidth="1.5" />
        </marker>
        <marker id="arr2" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M9 1L1 5L9 9" fill="none" stroke="rgba(255,200,60,0.6)" strokeWidth="1.5" />
        </marker>
      </defs>
      {/* Requête → */}
      <line x1="90" y1="68" x2="170" y2="68" stroke="rgba(0,255,209,0.6)" strokeWidth="1.5" markerEnd="url(#arr)" />
      <text x="130" y="62" fontSize="9" fill="rgba(0,255,209,0.8)" textAnchor="middle">GET /api</text>
      <line x1="250" y1="68" x2="330" y2="68" stroke="rgba(0,255,209,0.6)" strokeWidth="1.5" markerEnd="url(#arr)" />
      <text x="290" y="62" fontSize="9" fill="rgba(0,255,209,0.8)" textAnchor="middle">query</text>
      {/* Réponse ← */}
      <line x1="170" y1="88" x2="90" y2="88" stroke="rgba(255,200,60,0.6)" strokeWidth="1.5" markerEnd="url(#arr2)" />
      <text x="130" y="102" fontSize="9" fill="rgba(255,200,60,0.8)" textAnchor="middle">JSON</text>
      <line x1="330" y1="88" x2="250" y2="88" stroke="rgba(255,200,60,0.6)" strokeWidth="1.5" markerEnd="url(#arr2)" />
      <text x="290" y="102" fontSize="9" fill="rgba(255,200,60,0.8)" textAnchor="middle">data</text>
      {/* Noeuds */}
      {nodes.map((n) => (
        <g key={n.label}>
          <circle cx={n.x} cy={n.y} r="28" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" />
          <text x={n.x} y={n.y + 5} fontSize="16" textAnchor="middle">{n.icon}</text>
          <text x={n.x} y={n.y + 26} fontSize="8" fill="rgba(255,255,255,0.5)" textAnchor="middle">{n.label}</text>
        </g>
      ))}
    </svg>
  )
}

const CodeBlock = ({ children }) => (
  <pre className="rounded-xl p-4 overflow-x-auto text-xs leading-relaxed"
    style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)', color: '#D4EFFF', fontFamily: "'JetBrains Mono', monospace" }}>
    <code>{children}</code>
  </pre>
)

export default function FormationDevWebPage() {
  return (
    <div className="min-h-screen px-6 py-24">

      {/* Hero */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <span className="brand-badge brand-badge-cyan mb-4 inline-block">🌐 Formation complète</span>
        <h1 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: 'var(--brand-white)' }}>
          Développement Web
        </h1>
        <p className="text-base md:text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          De la première balise HTML à l'application fullstack déployée en production —
          maîtrise le stack moderne React + Node.js + MongoDB utilisé par les entreprises.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <Link href="/inscription">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="brand-btn brand-btn-cyan">
              S'inscrire à cette formation →
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Pourquoi */}
      <div className="max-w-3xl mx-auto mb-20 text-center">
        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--brand-white)' }}>
          Pourquoi le développement web ?
        </h2>
        <p className="text-sm md:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Le web est partout. Chaque startup, chaque entreprise, chaque administration a besoin
          de développeurs web. C'est le métier tech le plus accessible, le mieux payé en entrée
          de carrière, et celui qui ouvre le plus de portes — que tu veuilles travailler en
          Tunisie, en remote ou à l'étranger.
        </p>
      </div>

      {/* Exemple 1 : structure HTML */}
      <div className="max-w-5xl mx-auto mb-16">
        <div className="text-center mb-8">
          <span className="brand-badge brand-badge-cyan mb-3 inline-block">🏗️ Exemple concret — HTML/CSS</span>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--brand-white)' }}>
            Comprendre la structure d'une page web
          </h2>
        </div>
        <div className="brand-card p-6 md:p-8">
          <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--brand-white)' }}>Ce que tu vas faire :</strong> créer
            ta première page HTML structurée avec header, navigation, contenu principal et footer.
          </p>
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text-muted)' }}>Le code HTML</p>
              <CodeBlock>{`<!DOCTYPE html>
<html lang="fr">
<head>
  <title>Ma première page</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>Mon site</header>
  <nav>Accueil | Projets | Contact</nav>
  <main>
    <section>
      <h1>Bienvenue !</h1>
      <p>Mon premier projet web.</p>
    </section>
  </main>
  <footer>© 2026</footer>
</body>
</html>`}</CodeBlock>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text-muted)' }}>Structure visuelle</p>
              <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <AnatomieWeb />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exemple 2 : API REST */}
      <div className="max-w-5xl mx-auto mb-20">
        <div className="text-center mb-8">
          <span className="brand-badge brand-badge-gold mb-3 inline-block">⚙️ Exemple concret — Backend</span>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--brand-white)' }}>
            Créer une API REST avec Express
          </h2>
        </div>
        <div className="brand-card p-6 md:p-8">
          <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--brand-white)' }}>Objectif :</strong> construire un endpoint
            qui retourne une liste de cours en JSON — exactement comme fonctionne Codalog en coulisses.
          </p>
          <div className="grid md:grid-cols-2 gap-6 items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text-muted)' }}>Le serveur Express</p>
              <CodeBlock>{`import express from 'express'
const app = express()

const cours = [
  { id: 1, titre: 'HTML Bases' },
  { id: 2, titre: 'CSS Flexbox' },
  { id: 3, titre: 'React Hooks' },
]

app.get('/api/cours', (req, res) => {
  res.json(cours)
})

app.listen(5000, () =>
  console.log('Serveur démarré ✅')
)`}</CodeBlock>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text-muted)' }}>Flux requête → réponse</p>
              <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <FluxHTTP />
              </div>
              <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
                Le navigateur envoie une requête GET, le serveur la reçoit, interroge la base de données
                et retourne les données en JSON.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Aperçu chapitre */}
      <div className="max-w-4xl mx-auto mb-20 text-center">
        <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--brand-white)' }}>
          À quoi ressemble un chapitre ?
        </h2>
        <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
          Chaque chapitre suit la même structure éprouvée :
        </p>
        <div className="grid sm:grid-cols-3 gap-5">
          {[
            { n: '1', t: 'Cours théorique', d: 'Explication claire du concept avec exemples visuels et vidéo replay.' },
            { n: '2', t: 'Exercices guidés', d: 'QCM et exercices de complétion de code pour ancrer la notion.' },
            { n: '3', t: 'Mini-projet', d: 'Tu construis quelque chose de réel — une page, un composant, une API.' },
          ].map((s) => (
            <div key={s.n} className="brand-card p-5 text-left">
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-3"
                style={{ background: 'linear-gradient(135deg, #00FFD1, #00AAFF)', color: '#001830' }}>{s.n}</div>
              <h4 className="font-semibold mb-1" style={{ color: 'var(--brand-white)' }}>{s.t}</h4>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Programme */}
      <div className="max-w-5xl mx-auto mb-20">
        <h2 className="text-2xl font-bold text-center mb-10" style={{ color: 'var(--brand-white)' }}>
          Le programme complet
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {PROGRAMME.map((p) => (
            <div key={p.niveau} className="brand-card p-6">
              <h3 className="font-bold text-lg mb-4" style={{ color: 'var(--brand-white)' }}>{p.niveau}</h3>
              <ul className="flex flex-col gap-2">
                {p.points.map((pt) => (
                  <li key={pt} className="text-sm flex items-start gap-2" style={{ color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--brand-cyan)' }}>✓</span> {pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Stack technique */}
      <div className="max-w-4xl mx-auto mb-20">
        <h2 className="text-2xl font-bold text-center mb-8" style={{ color: 'var(--brand-white)' }}>
          Le stack que tu vas maîtriser
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: '🌐', name: 'HTML / CSS' },
            { icon: '⚡', name: 'JavaScript' },
            { icon: '⚛️', name: 'React.js' },
            { icon: '▲', name: 'Next.js' },
            { icon: '🟢', name: 'Node.js' },
            { icon: '🚂', name: 'Express' },
            { icon: '🍃', name: 'MongoDB' },
            { icon: '🐙', name: 'Git / GitHub' },
          ].map((t) => (
            <div key={t.name} className="brand-card p-4 text-center">
              <div className="text-2xl mb-2">{t.icon}</div>
              <p className="text-sm font-semibold" style={{ color: 'var(--brand-white)' }}>{t.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Compétences */}
      <div className="max-w-3xl mx-auto mb-20">
        <h2 className="text-2xl font-bold text-center mb-8" style={{ color: 'var(--brand-white)' }}>
          Ce que tu vas savoir faire
        </h2>
        <div className="brand-card p-6 flex flex-col gap-3">
          {COMPETENCES.map((c) => (
            <div key={c} className="flex items-start gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <span style={{ color: 'var(--brand-gold)' }}>★</span> {c}
            </div>
          ))}
        </div>
      </div>

      {/* Format */}
      <div className="max-w-4xl mx-auto mb-20 grid sm:grid-cols-3 gap-5 text-center">
        {[
          { icon: '🖥️', label: 'En ligne', text: 'Séances live hebdomadaires + replay disponible' },
          { icon: '🛠️', label: 'Projets réels', text: 'Tu construis des applications fonctionnelles' },
          { icon: '👨‍🏫', label: 'Suivi personnalisé', text: 'Code corrigé et commenté par le prof' },
        ].map((f) => (
          <div key={f.label} className="brand-card p-5">
            <div className="text-2xl mb-2">{f.icon}</div>
            <h4 className="font-semibold mb-1" style={{ color: 'var(--brand-white)' }}>{f.label}</h4>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{f.text}</p>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto mb-20">
        <h2 className="text-2xl font-bold text-center mb-8" style={{ color: 'var(--brand-white)' }}>
          Questions fréquentes
        </h2>
        <div className="flex flex-col gap-4">
          {FAQ.map((item) => (
            <div key={item.q} className="brand-card p-5">
              <p className="font-semibold text-sm mb-1" style={{ color: 'var(--brand-white)' }}>{item.q}</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.r}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA final */}
      <div className="text-center">
        <Link href="/inscription">
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="brand-btn brand-btn-cyan text-base px-8 py-3">
            Commencer Développement Web →
          </motion.button>
        </Link>
        <p className="mt-4 text-sm">
          <Link href="/formations" style={{ color: 'var(--brand-cyan)' }}>← Voir toutes nos formations</Link>
        </p>
      </div>

    </div>
  )
}
