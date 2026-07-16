'use client'

import Image from 'next/image'
import Link from 'next/link'

const formations = [
  {
    titre: 'Mathématiques & Python',
    description: "Chaque notion mathématique codée et visualisée en Python — du collège au BAC.",
    image: '/mathpy.png',
    duree: '8 semaines',
    niveau: 'Tous niveaux',
    prix: 'Sur demande',
    badge: 'cyan',
    href: '/formations/mathematiques-python',
  },
  {
    titre: 'Développement Web Fullstack',
    description: "Maîtrisez HTML, CSS, JavaScript, React, Node.js, MongoDB pour créer des applications web modernes.",
    image: '/web.jpeg',
    duree: '12 semaines',
    niveau: 'Intermédiaire',
    prix: 'Sur demande',
    badge: 'blue',
    href: '/formations/developpement-web',
  },
  {
    titre: 'Intelligence Artificielle & ML',
    description: "Découvrez les bases de l'IA, entraînez vos premiers modèles avec Python et Scikit-learn.",
    image: '/ia.jpg',
    duree: '10 semaines',
    niveau: 'Avancé',
    prix: 'Sur demande',
    badge: 'gold',
    href: '/formations/intelligence-artificielle',
  },
  {
    titre: 'Développement Mobile',
    description: "Créez des applications Android & iOS avec Flutter ou React Native.",
    image: '/mobile.jpg',
    duree: '8 semaines',
    niveau: 'Débutant',
    prix: 'Sur demande',
    badge: 'cyan',
    href: '/formations/developpement-mobile',
  },
  {
    titre: 'Gaming & Game Development',
    description: "Développez vos premiers jeux avec Unity ou Godot, apprenez la logique des moteurs 2D/3D.",
    image: '/gaming.jpeg',
    duree: '8 semaines',
    niveau: 'Tous niveaux',
    prix: 'Sur demande',
    badge: 'blue',
    href: '/formations/gaming',
  },
  {
    titre: 'Marketing Digital',
    description: "Gérez une stratégie marketing digitale, le SEO, les réseaux sociaux et l'analyse des campagnes.",
    image: '/marketing.webp',
    duree: '6 semaines',
    niveau: 'Tous niveaux',
    prix: 'Sur demande',
    badge: 'gold',
    href: '/formations/marketing-digital',
  },
]

const badgeStyle = {
  blue: { background: 'rgba(74,144,226,0.12)', border: '1px solid rgba(74,144,226,0.35)', color: '#4A90E2' },
  cyan: { background: 'rgba(0,255,209,0.08)',  border: '1px solid rgba(0,255,209,0.28)',  color: '#00FFD1' },
  gold: { background: 'rgba(255,215,0,0.1)',   border: '1px solid rgba(255,215,0,0.3)',   color: '#FFD700' },
}

export default function FormationsPage() {
  return (
    <div className="min-h-screen px-6 py-24">

      <h1
        className="text-3xl md:text-5xl font-bold mb-4 text-center"
        style={{ color: 'var(--brand-white)' }}
      >
        Nos formations
      </h1>
      <p className="text-center mb-12" style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
        Des programmes concrets, des formateurs expérimentés.
      </p>

      <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {formations.map((formation, idx) => (
          <div
            key={idx}
            className="brand-card"
            style={{
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.25s',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            {/* Image */}
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
              <Image
                src={formation.image}
                alt={formation.titre}
                fill
                style={{ objectFit: 'cover', transition: 'transform 0.4s' }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to bottom, transparent 50%, rgba(0,13,26,0.75) 100%)'
              }} />
            </div>

            {/* Contenu */}
            <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>

              {/* Titre + badge niveau */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--brand-white)', lineHeight: 1.3 }}>
                  {formation.titre}
                </h2>
                <span
                  className="brand-badge"
                  style={{ ...badgeStyle[formation.badge], flexShrink: 0, marginTop: '2px' }}
                >
                  {formation.niveau}
                </span>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {formation.description}
              </p>

              <hr className="brand-divider" style={{ margin: '4px 0' }} />

              {/* Durée + prix */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <span>⏱ {formation.duree}</span>
                <span style={{ color: 'var(--brand-cyan)' }}>💰 {formation.prix}</span>
              </div>

              {/* Boutons — Découvrir + S'inscrire */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <Link href={formation.href} style={{ flex: 1 }}>
                  <button
                    className="brand-btn"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    Découvrir →
                  </button>
                </Link>
                <Link href="/inscription" style={{ flex: 1 }}>
                  <button
                    className="brand-btn brand-btn-gold"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    S'inscrire
                  </button>
                </Link>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
