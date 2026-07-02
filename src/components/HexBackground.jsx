'use client'

/**
 * HexBackground — Fond global Codalog
 *
 * Pattern hexagonal SVG (référence CodalogLogo) en position fixed,
 * couvre toute la fenêtre derrière le contenu.
 * Branché une seule fois dans layout.js — toutes les pages en héritent.
 *
 * Usage dans layout.js :
 *   import HexBackground from '@/components/HexBackground'
 *   <HexBackground />
 */
export default function HexBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: '#000D1A',
      }}
    >
      {/* Gradient radial centré — halo bleu profond comme dans le logo */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 80% 60% at 50% 40%, #002966 0%, #001830 40%, #000D1A 100%)',
        }}
      />

      {/* Pattern hexagonal SVG — vrai pavage nid d'abeille (flat-top), stroke cyan du logo */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.05,
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/*
            Hexagone flat-top, rayon r = 26px
            Largeur tuile  = r * sqrt(3) ≈ 45
            Hauteur tuile  = r * 3 = 78  (2 rangées d'hexagones par tuile pour
            obtenir le vrai pavage en nid d'abeille, sans trous ni losanges)
          */}
          <pattern
            id="codalog-hex"
            x="0"
            y="0"
            width="45"
            height="78"
            patternUnits="userSpaceOnUse"
          >
            <polygon
              points="22.5,0 45,13 45,39 22.5,52 0,39 0,13"
              fill="none"
              stroke="#00FFD1"
              strokeWidth="0.8"
            />
            <polygon
              points="0,39 22.5,52 22.5,78 0,91 -22.5,78 -22.5,52"
              fill="none"
              stroke="#00FFD1"
              strokeWidth="0.8"
            />
            <polygon
              points="45,39 67.5,52 67.5,78 45,91 22.5,78 22.5,52"
              fill="none"
              stroke="#00FFD1"
              strokeWidth="0.8"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#codalog-hex)" />
      </svg>

      {/* Vignette douce sur les bords pour éviter l'effet tapisserie */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 55%, #000D1A 100%)',
        }}
      />
    </div>
  )
}
