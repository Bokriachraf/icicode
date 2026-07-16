'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'

const PROGRAMME = [
  { niveau: '🏫 Collège', points: ['Logique algorithmique de base', 'Premières notions de suites de nombres', 'Introduction douce à Python'] },
  { niveau: '🎓 Lycée', points: ['Suites arithmétiques & géométriques', 'Fonctions, limites, probabilités', 'Chaque notion codée et visualisée en Python', 'Préparation ciblée au BAC'] },
  { niveau: '🏛️ Université', points: ['Computational Thinking avancé', 'Algorithmique appliquée aux maths', 'Bases solides pour Data Science / IA'] },
]

const COMPETENCES = [
  'Décomposer un problème mathématique en étapes logiques',
  'Traduire une formule ou un théorème en code Python',
  'Visualiser suites, fonctions et probabilités avec du code',
  'Résoudre des exercices type BAC avec l\'aide de Python',
  'Construire une intuition algorithmique réutilisable partout (IA, dev, data)',
]

const FAQ = [
  { q: 'Il faut déjà savoir coder pour commencer ?', r: "Non. On part de zéro en Python — la formation est conçue pour des élèves qui découvrent le code à travers les maths qu'ils connaissent déjà." },
  { q: 'C\'est pour quel niveau exactement ?', r: "Du collège (bases de logique) au lycée (BAC) jusqu'à l'université (Computational Thinking avancé). Le programme s'adapte à ton niveau réel." },
  { q: 'Combien de temps pour voir des résultats ?', r: "Dès le premier chapitre : tu écris et exécutes ton premier programme qui résout un vrai exercice de maths." },
  { q: 'Quel matériel faut-il ?', r: "Juste un navigateur — l'éditeur Python tourne directement dans la page, aucune installation requise." },
]

// Génère le "d" d'un path SVG pour une fonction mathématique donnée
function genererPath(f, xMin, xMax, largeur, hauteur, yMin, yMax, pad = 30) {
  const nbPoints = 60
  const points = []
  for (let i = 0; i <= nbPoints; i++) {
    const x = xMin + (i / nbPoints) * (xMax - xMin)
    const y = f(x)
    const px = pad + ((x - xMin) / (xMax - xMin)) * (largeur - 2 * pad)
    const py = hauteur - pad - ((y - yMin) / (yMax - yMin)) * (hauteur - 2 * pad)
    points.push(`${i === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)}`)
  }
  return points.join(' ')
}

function CourbeFonction() {
  const f = (x) => x * x - 4 * x + 3
  const largeur = 420, hauteur = 280, pad = 34
  const xMin = -1, xMax = 5, yMin = -2, yMax = 8
  const toPx = (x) => pad + ((x - xMin) / (xMax - xMin)) * (largeur - 2 * pad)
  const toPy = (y) => hauteur - pad - ((y - yMin) / (yMax - yMin)) * (hauteur - 2 * pad)

  return (
    <svg viewBox={`0 0 ${largeur} ${hauteur}`} className="w-full h-auto">
      {/* Grille */}
      {Array.from({ length: xMax - xMin + 1 }, (_, i) => xMin + i).map((x) => (
        <line key={`vx${x}`} x1={toPx(x)} y1={pad} x2={toPx(x)} y2={hauteur - pad} stroke="rgba(255,255,255,0.06)" />
      ))}
      {Array.from({ length: 6 }, (_, i) => yMin + i * 2).map((y) => (
        <line key={`hy${y}`} x1={pad} y1={toPy(y)} x2={largeur - pad} y2={toPy(y)} stroke="rgba(255,255,255,0.06)" />
      ))}
      {/* Axes */}
      <line x1={pad} y1={toPy(0)} x2={largeur - pad} y2={toPy(0)} stroke="rgba(168,200,230,0.4)" strokeWidth="1" />
      <line x1={toPx(0)} y1={pad} x2={toPx(0)} y2={hauteur - pad} stroke="rgba(168,200,230,0.4)" strokeWidth="1" />
      {/* Courbe */}
      <path d={genererPath(f, xMin, xMax, largeur, hauteur, yMin, yMax, pad)} fill="none" stroke="var(--brand-cyan)" strokeWidth="2.5" />
      {/* Racines x=1 et x=3 */}
      {[1, 3].map((x) => (
        <circle key={x} cx={toPx(x)} cy={toPy(0)} r="4.5" fill="var(--brand-gold)" />
      ))}
      {/* Sommet (2, -1) */}
      <circle cx={toPx(2)} cy={toPy(-1)} r="4.5" fill="#FF6B6B" />
      <text x={toPx(2)} y={toPy(-1) + 18} fontSize="10" fill="#FF8A8A" textAnchor="middle">min</text>
      <text x={toPx(1)} y={toPy(0) - 8} fontSize="10" fill="var(--brand-gold)" textAnchor="middle">1</text>
      <text x={toPx(3)} y={toPy(0) - 8} fontSize="10" fill="var(--brand-gold)" textAnchor="middle">3</text>
    </svg>
  )
}

function GraphiqueSuite() {
  const u = (n) => 2 * n + 1
  const largeur = 420, hauteur = 220, pad = 30
  const n = 8
  const barW = (largeur - 2 * pad) / n - 8
  return (
    <svg viewBox={`0 0 ${largeur} ${hauteur}`} className="w-full h-auto">
      {Array.from({ length: n }, (_, i) => i).map((i) => {
        const val = u(i)
        const h = (val / u(n - 1)) * (hauteur - 2 * pad - 20)
        const x = pad + i * ((largeur - 2 * pad) / n)
        const y = hauteur - pad - h
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={h} rx="3" fill="var(--brand-cyan)" opacity={0.25 + i * 0.09} />
            <text x={x + barW / 2} y={hauteur - pad + 14} fontSize="9" fill="var(--text-muted)" textAnchor="middle">u{i}</text>
            <text x={x + barW / 2} y={y - 6} fontSize="9" fill="var(--brand-white)" textAnchor="middle">{val}</text>
          </g>
        )
      })}
      <line x1={pad} y1={hauteur - pad} x2={largeur - pad} y2={hauteur - pad} stroke="rgba(168,200,230,0.4)" />
    </svg>
  )
}

const CodeBlock = ({ children }) => (
  <pre className="rounded-xl p-4 overflow-x-auto text-xs leading-relaxed" style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)', color: '#D4EFFF', fontFamily: "'JetBrains Mono', monospace" }}>
    <code>{children}</code>
  </pre>
)

export default function FormationMathPythonPage() {
  return (
    <div className="min-h-screen px-6 py-24">

      {/* Hero */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <span className="brand-badge brand-badge-gold mb-4 inline-block">🧠 Notre formation fondation</span>
        <h1 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: 'var(--brand-white)' }}>
          Mathématiques & Python
        </h1>
        <p className="text-base md:text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Le programme qui relie les mathématiques que tu apprends en classe au code qui les rend concrètes —
          du collège jusqu'à l'université, la base du Computational Thinking.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <Link href="/inscription">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="brand-btn brand-btn-gold">
              S'inscrire à cette formation →
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Pourquoi */}
      <div className="max-w-3xl mx-auto mb-20 text-center">
        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--brand-white)' }}>
          Pourquoi cette formation ?
        </h2>
        <p className="text-sm md:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Beaucoup d'élèves apprennent les maths de façon abstraite, sans jamais les manipuler concrètement.
          Ici, chaque suite, chaque fonction, chaque probabilité est immédiatement codée en Python — tu comprends
          la notion en la voyant tourner, et tu construis en même temps la logique algorithmique qui sert ensuite
          partout : développement, data science, intelligence artificielle.
        </p>
      </div>

      {/* ===== EXEMPLE DÉTAILLÉ 1 : étude de fonction ===== */}
      <div className="max-w-5xl mx-auto mb-16">
        <div className="text-center mb-8">
          <span className="brand-badge brand-badge-cyan mb-3 inline-block">📐 Exemple concret — Niveau Lycée</span>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--brand-white)' }}>
            Étudier une fonction, la coder, voir sa courbe
          </h2>
        </div>

        <div className="brand-card p-6 md:p-8">
          <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--brand-white)' }}>Énoncé :</strong> On considère la fonction
            f(x) = x² − 4x + 3 sur ℝ. Déterminer ses racines, son minimum, puis tracer sa courbe.
          </p>

          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text-muted)' }}>Le code Python</p>
              <CodeBlock>{`import numpy as np
import matplotlib.pyplot as plt

def f(x):
    return x**2 - 4*x + 3

x = np.linspace(-1, 5, 100)
y = f(x)

plt.plot(x, y)
plt.axhline(0, color='gray')
plt.title("f(x) = x² - 4x + 3")
plt.show()`}</CodeBlock>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text-muted)' }}>La courbe obtenue</p>
              <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <CourbeFonction />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 grid sm:grid-cols-3 gap-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div>
              <p className="text-xs font-semibold" style={{ color: 'var(--brand-gold)' }}>🟡 Racines</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>x = 1 et x = 3 — la courbe croise l'axe des x exactement là où on résout f(x) = 0.</p>
            </div>
            <div>
              <p className="text-xs font-semibold" style={{ color: '#FF8A8A' }}>🔴 Minimum</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>En x = 2, f(2) = −1 — le sommet de la parabole, visible immédiatement sur le graphique.</p>
            </div>
            <div>
              <p className="text-xs font-semibold" style={{ color: 'var(--brand-cyan)' }}>💡 Ce que tu apprends</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Le lien entre le calcul (factorisation, dérivée) et sa traduction visuelle instantanée en code.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== EXEMPLE DÉTAILLÉ 2 : suite numérique ===== */}
      <div className="max-w-5xl mx-auto mb-20">
        <div className="text-center mb-8">
          <span className="brand-badge brand-badge-cyan mb-3 inline-block">🔢 Exemple concret — Suites</span>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--brand-white)' }}>
            Générer et visualiser une suite arithmétique
          </h2>
        </div>

        <div className="brand-card p-6 md:p-8">
          <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--brand-white)' }}>Énoncé :</strong> Soit (uₙ) définie par uₙ = 2n + 1.
            Calculer et représenter ses 8 premiers termes.
          </p>
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text-muted)' }}>Le code Python</p>
              <CodeBlock>{`def u(n):
    return 2 * n + 1

for n in range(8):
    print(f"u({n}) =", u(n))`}</CodeBlock>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text-muted)' }}>Les termes visualisés</p>
              <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <GraphiqueSuite />
              </div>
            </div>
          </div>
          <p className="mt-5 text-sm" style={{ color: 'var(--text-secondary)' }}>
            En quelques lignes, tu visualises immédiatement que la suite est <strong style={{ color: 'var(--brand-cyan)' }}>croissante</strong> —
            exactement le genre de conjecture qu'on te demande de démontrer au BAC, mais que tu peux d'abord observer.
          </p>
        </div>
      </div>

      {/* Aperçu chapitre */}
      <div className="max-w-4xl mx-auto mb-20 text-center">
        <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--brand-white)' }}>
          À quoi ressemble un chapitre ?
        </h2>
        <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
          Chaque chapitre suit toujours la même structure, pour que tu saches toujours où tu en es :
        </p>
        <div className="grid sm:grid-cols-3 gap-5">
          {[
            { n: '1', t: 'Cours', d: 'La notion expliquée clairement, avec vidéo et support.' },
            { n: '2', t: 'Exercices Math', d: 'QCM et exercices pour vérifier ta compréhension.' },
            { n: '3', t: 'Projet Python', d: 'Tu codes la notion toi-même, dans l\'éditeur intégré.' },
          ].map((s) => (
            <div key={s.n} className="brand-card p-5 text-left">
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-3" style={{ background: 'linear-gradient(135deg, #00FFD1, #00AAFF)', color: '#001830' }}>{s.n}</div>
              <h4 className="font-semibold mb-1" style={{ color: 'var(--brand-white)' }}>{s.t}</h4>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Programme par niveau */}
      <div className="max-w-5xl mx-auto mb-20">
        <h2 className="text-2xl font-bold text-center mb-10" style={{ color: 'var(--brand-white)' }}>
          Un programme qui suit ton niveau
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
          { icon: '🖥️', label: 'En ligne', text: 'Séances live + replay disponible' },
          { icon: '📝', label: 'Exercices interactifs', text: 'QCM, complétion, projets Python' },
          { icon: '👨‍🏫', label: 'Suivi personnalisé', text: 'Progression suivie chapitre par chapitre' },
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
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="brand-btn brand-btn-gold text-base px-8 py-3">
            Commencer Mathématiques & Python →
          </motion.button>
        </Link>
        <p className="mt-4 text-sm">
          <Link href="/formations" style={{ color: 'var(--brand-cyan)' }}>← Voir toutes nos formations</Link>
        </p>
      </div>
    </div>
  )
}
