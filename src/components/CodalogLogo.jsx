'use client'
import { useEffect, useRef } from 'react'

/**
 * CodalogLogo — Composant React (Next.js compatible)
 * 
 * Usage dans app/page.js :
 *   import CodalogLogo from '@/components/CodalogLogo'
 *   <CodalogLogo size={340} showWordmark={true} />
 *
 * Props :
 *   size        : number  — largeur/hauteur du SVG (défaut 380)
 *   showWordmark: boolean — affiche C O D @ L O G + tagline (défaut true)
 */
export default function CodalogLogo({ size = 380, showWordmark = true }) {
  const dotRef = useRef(null)
  const frameRef = useRef(null)

  useEffect(() => {
    const dot = dotRef.current
    if (!dot) return

    const R_HEX = 110
    const R_CIRCLE = 195
    const LINE_DURATION = 800
    const ARC_DURATION = 2000
    const FADE_DURATION = 200

    const rad = d => d * Math.PI / 180

    const nodes = [
      { color: '#4A90E2', angleHex: 270, angleCircle: 270 },
      { color: '#FFD700', angleHex: 330, angleCircle: 330 },
      { color: '#FFFFFF', angleHex:  30, angleCircle:  30 },
      { color: '#4A90E2', angleHex:  90, angleCircle:  90 },
      { color: '#FFFFFF', angleHex: 150, angleCircle: 150 },
      { color: '#FFD700', angleHex: 210, angleCircle: 210 },
    ]

    const polar = (angleDeg, r) => ({
      x: r * Math.cos(rad(angleDeg)),
      y: r * Math.sin(rad(angleDeg)),
    })

    const easeIn    = t => t * t
    const easeInOut = t => t < 0.5 ? 2*t*t : -1+(4-2*t)*t
    const lerp      = (a, b, t) => a + (b - a) * t

    const setDot = (x, y, color, opacity) => {
      dot.setAttribute('cx', x.toFixed(3))
      dot.setAttribute('cy', y.toFixed(3))
      dot.setAttribute('fill', color)
      dot.setAttribute('opacity', opacity.toFixed(3))
      dot.setAttribute('r', (7 + opacity * 2).toFixed(2))
    }

    let currentPhase = 0
    let phaseStartTime = null
    const TOTAL = LINE_DURATION + ARC_DURATION + FADE_DURATION

    const runPhase = (phase, elapsed) => {
      const node     = nodes[phase]
      const nextNode = nodes[(phase + 1) % 6]
      const hex   = polar(node.angleHex, R_HEX)
      const start = polar(node.angleCircle, R_CIRCLE)
      const end   = polar(nextNode.angleCircle, R_CIRCLE)

      if (elapsed <= LINE_DURATION) {
        const p = easeIn(elapsed / LINE_DURATION)
        setDot(lerp(hex.x, start.x, p), lerp(hex.y, start.y, p), node.color, 1)

      } else if (elapsed <= LINE_DURATION + ARC_DURATION) {
        const arcElapsed = elapsed - LINE_DURATION
        const p = easeInOut(arcElapsed / ARC_DURATION)
        let delta = nextNode.angleCircle - node.angleCircle
        if (delta < 0) delta += 360
        const pos = polar(node.angleCircle + delta * p, R_CIRCLE)
        setDot(pos.x, pos.y, node.color, 1)

      } else {
        const fadeP = (elapsed - LINE_DURATION - ARC_DURATION) / FADE_DURATION
        setDot(end.x, end.y, node.color, Math.max(0, 1 - fadeP))
      }

      return elapsed >= TOTAL
    }

    const animate = (timestamp) => {
      if (!phaseStartTime) phaseStartTime = timestamp
      const elapsed = timestamp - phaseStartTime
      const done = runPhase(currentPhase, elapsed)
      if (done) {
        currentPhase = (currentPhase + 1) % 6
        phaseStartTime = timestamp
        dot.setAttribute('opacity', '0')
      }
      frameRef.current = requestAnimationFrame(animate)
    }

    dot.setAttribute('opacity', '0')
    frameRef.current = requestAnimationFrame(animate)

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [])

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <svg viewBox="-215 -215 430 430" width={size} height={size}
           xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="lgC" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00FFD1"/><stop offset="100%" stopColor="#00AAFF"/>
          </linearGradient>
          <linearGradient id="lgG" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700"/><stop offset="100%" stopColor="#FF8C00"/>
          </linearGradient>
          <radialGradient id="lgOrb" cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#002966"/><stop offset="100%" stopColor="#000D1A"/>
          </radialGradient>
          <radialGradient id="lgAmb" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#001830" stopOpacity="0.55"/>
            <stop offset="100%" stopColor="#000814" stopOpacity="0"/>
          </radialGradient>
          <filter id="lfC"><feGaussianBlur stdDeviation="3" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <filter id="lfG"><feGaussianBlur stdDeviation="2.5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <filter id="lfW"><feGaussianBlur stdDeviation="2" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <filter id="lfS"><feGaussianBlur stdDeviation="1.5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <filter id="lfBl"><feGaussianBlur stdDeviation="3.5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <filter id="lfOrb"><feGaussianBlur stdDeviation="6" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>

        {/* Ambient */}
        <circle cx="0" cy="0" r="205" fill="url(#lgAmb)"/>

        {/* Cercle extérieur R=195 */}
        <circle cx="0" cy="0" r="195" fill="none"
          stroke="url(#lgC)" strokeWidth="1.3" opacity="0.25" filter="url(#lfS)"/>

        {/* Hexagone pointy-top R=110 */}
        <polygon points="0,-110 95.3,-55 95.3,55 0,110 -95.3,55 -95.3,-55"
          fill="none" stroke="url(#lgC)" strokeWidth="2" opacity="0.7" filter="url(#lfS)">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="4s" repeatCount="indefinite"/>
        </polygon>

        {/* Hexagone intérieur R=62 */}
        <polygon points="0,-62 53.7,-31 53.7,31 0,62 -53.7,31 -53.7,-31"
          fill="none" stroke="url(#lgC)" strokeWidth="0.6" opacity="0.14"/>

        {/* Lignes radiales tirets sommet→cercle */}
        <g strokeDasharray="3 4" strokeWidth="0.9" opacity="0.2">
          <line x1="0"     y1="-110" x2="0"      y2="-195"  stroke="#4A90E2"/>
          <line x1="95.3"  y1="-55"  x2="168.9"  y2="-97.5" stroke="#FFD700"/>
          <line x1="95.3"  y1="55"   x2="168.9"  y2="97.5"  stroke="#FFFFFF"/>
          <line x1="0"     y1="110"  x2="0"      y2="195"   stroke="#4A90E2"/>
          <line x1="-95.3" y1="55"   x2="-168.9" y2="97.5"  stroke="#FFFFFF"/>
          <line x1="-95.3" y1="-55"  x2="-168.9" y2="-97.5" stroke="#FFD700"/>
        </g>

        {/* Nœuds statiques sur les sommets */}
        <circle cx="0"     cy="-110" r="5" fill="#4A90E2" filter="url(#lfBl)" opacity="0.9"/>
        <circle cx="95.3"  cy="-55"  r="5" fill="#FFD700" filter="url(#lfG)"  opacity="0.9"/>
        <circle cx="95.3"  cy="55"   r="5" fill="#FFFFFF" filter="url(#lfW)"  opacity="0.85"/>
        <circle cx="0"     cy="110"  r="5" fill="#4A90E2" filter="url(#lfBl)" opacity="0.9"/>
        <circle cx="-95.3" cy="55"   r="5" fill="#FFFFFF" filter="url(#lfW)"  opacity="0.85"/>
        <circle cx="-95.3" cy="-55"  r="5" fill="#FFD700" filter="url(#lfG)"  opacity="0.9"/>

        {/* Labels */}
        {/* S0 DÉPLOIEMENT */}
        <text transform="translate(0,-110) rotate(-90)" x="14" y="0"
          textAnchor="start" dominantBaseline="middle"
          fill="#4A90E2" fontSize="12" fontFamily="'JetBrains Mono','Courier New',monospace"
          fontWeight="600" letterSpacing="0" opacity="0.95" filter="url(#lfBl)">{'>>>>>>>>> Web & Mobile'}</text>

        {/* S1 BACKEND */}
        <text transform="translate(95.3,-55) rotate(-30)" x="14" y="0"
          textAnchor="start" dominantBaseline="middle"
          fill="#FFD700" fontSize="12" fontFamily="'JetBrains Mono','Courier New',monospace"
          fontWeight="600" letterSpacing="0.3" opacity="0.95" filter="url(#lfG)">{'>>>>>>>>> Backend'}</text>

        {/* S2 MODÈLE AI */}
        <text transform="translate(95.3,55) rotate(30)" x="14" y="0"
          textAnchor="start" dominantBaseline="middle"
          fill="#FFFFFF" fontSize="12" fontFamily="'JetBrains Mono','Courier New',monospace"
          fontWeight="600" letterSpacing="0.3" opacity="0.9" filter="url(#lfW)">{'>>>>>>>>> Modèle AI'}</text>

        {/* S3 DÉVELOPPEMENT */}
        <text transform="translate(0,110) rotate(90)" x="14" y="0"
          textAnchor="start" dominantBaseline="middle"
          fill="#4A90E2" fontSize="12" fontFamily="'JetBrains Mono','Courier New',monospace"
          fontWeight="600" letterSpacing="0" opacity="0.95" filter="url(#lfBl)">{'>>>>>>>>> Développement'}</text>

        {/* S4 BLOCKCHAIN */}
        <text transform="translate(-95.3,55) rotate(-30)" x="-14" y="0"
          textAnchor="end" dominantBaseline="middle"
          fill="#FFFFFF" fontSize="12" fontFamily="'JetBrains Mono','Courier New',monospace"
          fontWeight="600" letterSpacing="0.3" opacity="0.9" filter="url(#lfW)">{'Blockchain <<<<<<<<<'}</text>

        {/* S5 FRONTEND */}
        <text transform="translate(-95.3,-55) rotate(30)" x="-14" y="0"
          textAnchor="end" dominantBaseline="middle"
          fill="#FFD700" fontSize="12" fontFamily="'JetBrains Mono','Courier New',monospace"
          fontWeight="600" letterSpacing="0.3" opacity="0.95" filter="url(#lfG)">{'Frontend <<<<<<<<<'}</text>

        {/* Point animé — contrôlé par useEffect */}
        <circle ref={dotRef} cx="0" cy="-110" r="8"
          fill="#4A90E2" filter="url(#lfOrb)" opacity="0"/>

        {/* Cercle central R=72 */}
        <circle cx="0" cy="0" r="72" fill="url(#lgOrb)" stroke="url(#lgC)"
          strokeWidth="2" filter="url(#lfC)" opacity="0.98"/>
        <circle cx="0" cy="0" r="63" fill="none" stroke="#00FFD1" strokeWidth="0.6" opacity="0.13"/>
        <ellipse cx="-14" cy="-20" rx="17" ry="9" fill="white" opacity="0.04" transform="rotate(-30)"/>

        {/* < ∞ > */}
        <text x="-26" y="-10" textAnchor="middle" dominantBaseline="central"
          fill="url(#lgC)" fontSize="28"
          fontFamily="'JetBrains Mono','Courier New',monospace"
          fontWeight="700" filter="url(#lfC)">&lt;</text>
        <text x="0" y="-8" textAnchor="middle" dominantBaseline="central"
          fill="url(#lgG)" fontSize="26"
          fontFamily="Georgia,'Times New Roman',serif"
          fontWeight="400" filter="url(#lfG)">
          ∞
          <animate attributeName="opacity" values="1;0.35;1" dur="3s" repeatCount="indefinite"/>
        </text>
        <text x="26" y="-10" textAnchor="middle" dominantBaseline="central"
          fill="url(#lgC)" fontSize="28"
          fontFamily="'JetBrains Mono','Courier New',monospace"
          fontWeight="700" filter="url(#lfC)">&gt;</text>

        {/* Séparateur + Mathématique */}
        <line x1="-32" y1="16" x2="32" y2="16" stroke="#00FFD1" strokeWidth="0.6" opacity="0.3"/>
        <text x="0" y="22" textAnchor="middle" dominantBaseline="hanging"
          fill="#6ECFB0" fontSize="8.5"
          fontFamily="'JetBrains Mono','Courier New',monospace"
          fontWeight="400" letterSpacing="1.5" opacity="0.82">Mathématique</text>
      </svg>

      {showWordmark && (
        <div style={{ marginLeft: '150px' , display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          {/* C O D @ L O G — blanc sauf O et @ en bleu */}
          <div style={{ display: 'flex', alignItems: 'baseline', letterSpacing: '-1px' }}>
            {[
              { char: 'C', blue: false },
              { char: 'O', blue: true  },
              { char: 'D', blue: false },
              { char: '@', blue: true  },
              { char: 'L', blue: false },
              { char: 'O', blue: true  },
              { char: 'G', blue: false },
            ].map(({ char, blue }, i) => (
              <span key={i} style={{
                fontFamily: "'JetBrains Mono','Courier New',monospace",
                fontWeight: 800,
                fontSize: '2.2rem',
                color: blue ? '#00AAFF' : '#ffffff',
                filter: blue ? 'drop-shadow(0 0 8px rgba(0,180,255,0.6))' : 'none',
              }}>{char}</span>
            ))}
          </div>
          <div style={{
            fontSize: '0.54rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(100,160,220,0.55)',
          }}>
            Code{' '}
            <span style={{ color: 'rgba(0,255,209,0.45)', margin: '0 0.3rem' }}>·</span>
            Math{' '}
            <span style={{ color: 'rgba(0,255,209,0.45)', margin: '0 0.3rem' }}>·</span>
            Intelligence
          </div>
        </div>
      )}
    </div>
  )
}
