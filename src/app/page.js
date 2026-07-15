'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'
import CodalogLogo from '@/components/CodalogLogo'

const lineVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.6 } }),
}

const NIVEAUX = [
  { icon: '🏫', label: 'Collège', desc: "Premiers pas en algorithmique et logique mathématique, dès la 7ème année." },
  { icon: '🎓', label: 'Lycée', desc: "Suites, fonctions, probabilités — approfondis avec Python, prépare ton BAC." },
  { icon: '🏛️', label: 'Université', desc: "Computational Thinking avancé : la base de l'IA, la Data Science et l'ingénierie." },
]

const FORMATIONS = [
  { name: 'Mathématiques & Python', img: '/mathpy.png', badge: 'Fondation' },
  { name: 'Développement Web', img: '/web.jpeg' },
  { name: 'IA & Machine Learning', img: '/ia.jpg' },
  { name: 'Gaming', img: '/gaming.jpeg' },
  { name: 'Blockchain & Sécurité', img: '/blockchain.jpg' },
  { name: 'Digital Marketing', img: '/marketing.webp' },
]

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* ================= HERO ================= */}
      <main className="relative z-10 flex flex-col md:flex-row min-h-screen items-center justify-between px-6 md:px-10 gap-12 pt-28 pb-16 max-w-7xl mx-auto">
        <motion.div
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl"
        >
          <motion.div custom={0} variants={lineVariants} initial="hidden" animate="visible" className="mb-4">
            <span className="brand-badge brand-badge-cyan">🧠 Collège · Lycée · Université</span>
          </motion.div>

          <motion.h1
            custom={1} variants={lineVariants} initial="hidden" animate="visible"
            className="text-3xl md:text-5xl font-bold mb-4 tracking-tight"
            style={{ color: 'var(--brand-white)' }}
          >
            Le Computational Thinking, fondation de toutes les carrières numériques
          </motion.h1>

          <motion.div
            custom={2} variants={lineVariants} initial="hidden" animate="visible"
            className="text-base md:text-lg mb-8 leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            De la logique algorithmique au collège jusqu'à l'IA à l'université, Codalog forme aux compétences qui comptent :
            <br />
            <TypeAnimation
              sequence={[
                'Mathématiques & Python 🧮', 2000,
                'Développement Web 💻', 2000,
                'Intelligence Artificielle 🤖', 2000,
                'Data Science 📊', 2000,
              ]}
              wrapper="span"
              cursor
              repeat={Infinity}
              className="font-semibold"
              style={{ color: 'var(--brand-cyan)' }}
            />
          </motion.div>

          <motion.div custom={3} variants={lineVariants} initial="hidden" animate="visible" className="flex flex-wrap gap-3">
            <Link href="/inscription">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="brand-btn brand-btn-gold">
                Inscription gratuite →
              </motion.button>
            </Link>
            <Link href="/formations">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="brand-btn">
                Découvrir nos formations
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <CodalogLogo size={320} showWordmark={true} />
        </motion.div>
      </main>

      {/* ================= BANDE NIVEAUX ================= */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-5">
          {NIVEAUX.map((n, i) => (
            <motion.div
              key={n.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="brand-card p-6"
            >
              <div className="text-3xl mb-3">{n.icon}</div>
              <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--brand-white)' }}>{n.label}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{n.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= COMPUTATIONAL THINKING ================= */}
      <section className="relative z-10 py-20" style={{ background: 'var(--brand-dark)', borderTop: '1px solid var(--border-card)', borderBottom: '1px solid var(--border-card)' }}>
        <div className="max-w-5xl mx-auto px-6 text-center">
          <span className="brand-badge brand-badge-gold mb-4 inline-block">🧠 Notre fondation</span>
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: 'var(--brand-white)' }}>
            Pourquoi le Computational Thinking d'abord ?
          </h2>
          <p className="max-w-2xl mx-auto mb-10 text-sm md:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Avant de coder une app ou d'entraîner un modèle d'IA, il faut savoir décomposer un problème et raisonner comme un algorithme.
            C'est la compétence que les grandes écoles d'ingénieurs et l'université attendent — et c'est celle qu'on enseigne dès le lycée,
            avec les mathématiques et Python comme terrain d'entraînement.
          </p>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { icon: '🧩', title: 'Logique algorithmique', text: 'Décomposer, généraliser, automatiser un raisonnement.' },
              { icon: '📐', title: 'Maths appliquées', text: 'Suites, fonctions, probabilités — reliées à du code concret.' },
              { icon: '🐍', title: 'Python dès le départ', text: 'Chaque notion mathématique se traduit immédiatement en code.' },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="brand-card p-5"
              >
                <div className="text-2xl mb-2">{f.icon}</div>
                <h4 className="font-semibold mb-1" style={{ color: 'var(--brand-white)' }}>{f.title}</h4>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{f.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FORMATIONS PHARES ================= */}
      <section className="relative z-10 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-center text-2xl md:text-3xl font-bold mb-12" style={{ color: 'var(--brand-white)' }}>
            Nos formations
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {FORMATIONS.map((f, i) => (
              <motion.div
                key={f.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="brand-card overflow-hidden flex flex-col"
              >
                <div className="relative w-full aspect-[16/9]">
                  <Image src={f.img} alt={f.name} fill className="object-cover" />
                  {f.badge && (
                    <span className="absolute top-3 left-3 brand-badge brand-badge-gold">{f.badge}</span>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between gap-3">
                  <h3 className="font-semibold" style={{ color: 'var(--brand-white)' }}>{f.name}</h3>
                  <Link href="/formations" className="text-sm font-medium self-start" style={{ color: 'var(--brand-cyan)' }}>
                    Découvrir →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= NOS ATOUTS ================= */}
      <section className="relative z-10 py-20" style={{ background: 'var(--brand-dark)', borderTop: '1px solid var(--border-card)', borderBottom: '1px solid var(--border-card)' }}>
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6">
          {[
            { icon: '🛠️', title: 'Projets concrets', text: 'Des exercices et projets réels, pas juste de la théorie.' },
            { icon: '👨‍🏫', title: 'Suivi personnalisé', text: 'Un formateur suit ta progression, chapitre par chapitre.' },
            { icon: '🎯', title: 'De l\'école à l\'emploi', text: 'Des bases solides au collège jusqu\'aux compétences pros à l\'université.' },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="brand-card p-6"
            >
              <div className="text-2xl mb-3">{item.icon}</div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--brand-white)' }}>{item.title}</h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= TÉMOIGNAGES ================= */}
      <section className="relative z-10 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-center text-2xl md:text-3xl font-bold mb-10" style={{ color: 'var(--brand-white)' }}>
            Ils progressent avec Codalog
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { name: 'Sami, Terminale', text: "Les suites et les probas sont enfin claires depuis que je les code en Python avec Codalog." },
              { name: 'Ines, Université', text: "Le Computational Thinking appris ici m'a vraiment aidée à démarrer en Data Science." },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="brand-card p-6"
              >
                <p className="italic text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>"{t.text}"</p>
                <p className="mt-4 font-semibold text-sm" style={{ color: 'var(--brand-cyan)' }}>— {t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA FINAL ================= */}
      <section className="relative z-10 py-20 text-center px-6" style={{ background: 'linear-gradient(180deg, var(--brand-dark), var(--brand-mid))' }}>
        <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--brand-white)' }}>
          Prêt à construire tes fondations numériques ?
        </h2>
        <p className="mb-8 text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>
          Collège, lycée ou université — commence dès aujourd'hui, gratuitement.
        </p>
        <Link href="/inscription">
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="brand-btn brand-btn-gold text-base px-8 py-3">
            Commencer gratuitement →
          </motion.button>
        </Link>
      </section>
    </div>
  )
}
