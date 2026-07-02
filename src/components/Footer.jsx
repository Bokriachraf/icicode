'use client'
import { FaFacebookF, FaLinkedinIn } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer
      style={{
        /* En flux normal (pas fixed) — s'affiche sous le contenu */
        position: 'relative',
        zIndex: 10,
        background: 'rgba(0, 13, 26, 0.85)',
        borderTop: '1px solid rgba(0, 255, 209, 0.1)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        padding: '14px 24px',
      }}
    >
      <div
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <p style={{ fontSize: '0.75rem', color: 'rgba(168, 200, 230, 0.6)', margin: 0 }}>
          &copy; {new Date().getFullYear()}{' '}
          <span style={{ fontWeight: 700, color: '#E8F4FF' }}>Codalog</span>
          {' '}— Tous droits réservés.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <a
            href="https://www.facebook.com/tonprofil"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            style={{ color: 'rgba(168, 200, 230, 0.5)', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#4A90E2')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(168, 200, 230, 0.5)')}
          >
            <FaFacebookF size={15} />
          </a>
          <a
            href="https://www.linkedin.com/in/tonprofil"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            style={{ color: 'rgba(168, 200, 230, 0.5)', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#00FFD1')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(168, 200, 230, 0.5)')}
          >
            <FaLinkedinIn size={15} />
          </a>
        </div>
      </div>
    </footer>
  )
}
