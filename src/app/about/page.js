'use client'

import Image from 'next/image'

export default function AboutPage() {
  return (
    <main className="pt-24 pb-16 px-6 min-h-screen" style={{ color: 'var(--text-primary)' }}>
      <div className="max-w-5xl mx-auto space-y-12">

        {/* En-tête */}
        <section className="text-center">
          <h1
            className="text-4xl font-bold mb-4"
            style={{ color: 'var(--brand-white)' }}
          >
            À propos de{' '}
            <span style={{ color: 'var(--brand-cyan)' }}>Codalog</span>
          </h1>
          <hr className="brand-divider" />
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto' }}>
            Centre de formation continue en développement Web, Mobile, IA, Data Science,
            Marketing digital et bien plus encore.
          </p>
        </section>

        {/* Mission */}
        <section className="grid md:grid-cols-2 gap-10 items-center">
          <div className="brand-card p-6">
            <h2 className="text-2xl font-semibold mb-3" style={{ color: 'var(--brand-gold)' }}>
              Notre mission
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75' }}>
              Chez <strong style={{ color: 'var(--brand-white)' }}>Codalog</strong>, nous croyons
              au pouvoir de la technologie pour transformer les carrières. Notre mission est d'offrir
              des formations pratiques et accessibles, en ligne et en présentiel à Tunis, pour
              préparer nos apprenants à exceller dans les métiers du numérique.
            </p>
          </div>
          <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-card)' }}>
            <Image
              src="/icicode-classroom.webp"
              alt="Formation Codalog"
              width={600}
              height={400}
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />
          </div>
        </section>

        {/* Domaines */}
        <section className="brand-card p-6">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-cyan)' }}>
            Nos domaines de formation
          </h2>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              'Développement Web & Mobile (Fullstack, React, Node, Flutter…)',
              'Intelligence Artificielle & Machine Learning',
              'Data Science & Data Analysis',
              'Création de jeux vidéo (Unity, Godot)',
              'Marketing Digital & Community Management',
              'Management de projet et soft skills',
            ].map((item, i) => (
              <li
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  color: 'var(--text-secondary)',
                  fontSize: '0.95rem',
                }}
              >
                <span style={{ color: 'var(--brand-cyan)', marginTop: '2px', flexShrink: 0 }}>›</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Pourquoi nous */}
        <section className="brand-card p-6">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
            Pourquoi nous choisir ?
          </h2>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              'Formations 100% orientées pratique et projets réels',
              'Accès à des instructeurs expérimentés et disponibles',
              'Sessions en ligne & en présentiel',
              'Certificat de fin de formation',
            ].map((item, i) => (
              <li
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  color: 'var(--text-secondary)',
                  fontSize: '0.95rem',
                }}
              >
                <span style={{ color: 'var(--brand-gold)', marginTop: '2px', flexShrink: 0 }}>›</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Contact */}
        <section className="brand-card p-6" id="contact">
          <h2 className="text-2xl font-semibold mb-3" style={{ color: 'var(--brand-white)' }}>
            Nous contacter
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Envie d'en savoir plus sur nos parcours ou de rejoindre une session ?{' '}
            <a
              href="mailto:contact@icicode.tn"
              style={{ color: 'var(--brand-cyan)', textDecoration: 'underline' }}
            >
              contact@icicode.tn
            </a>{' '}
            ou rendez-vous sur la page{' '}
            <a
              href="/contact"
              style={{ color: 'var(--brand-cyan)', textDecoration: 'underline' }}
            >
              Contact
            </a>.
          </p>
        </section>

      </div>
    </main>
  )
}
