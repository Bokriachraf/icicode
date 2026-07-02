'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaTruckLoading, FaHandsHelping, FaChartLine } from 'react-icons/fa';

const activites = [
  {
    title: 'programmation-mathemathique',
    description:
      "Représentation des cours",
    icon: FaTruckLoading,
  },
  {
    title: "programmation-mathemathique",
    description:
      "Aide à l'élaboration, la soumission et le suivi",
    icon: FaHandsHelping,
  },
  {
    title: "Études et conseils ",
    description:
      "programmation-mathemathique",
    icon: FaChartLine,
  },
];

export default function ActivitesPage() {
  return (
    <div className="min-h-screen pt-24 pb-24 px-6" style={{ color: 'var(--text-primary)' }}>
      <div className="max-w-5xl mx-auto space-y-12">
        <motion.h1
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center"
          style={{ color: 'var(--brand-white)' }}
        >
          Nos Activités
        </motion.h1>

        <div className="grid gap-10 md:grid-cols-3">
          {activites.map(({ title, description, icon: Icon }, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="brand-card p-6 hover:scale-105 transition-transform duration-300 ease-in-out text-center flex flex-col items-center"
            >
              <div className="mb-4 w-20 h-20 flex items-center justify-center text-5xl" style={{ color: 'var(--brand-gold)' }}>
                <Icon />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--brand-white)' }}>{title}</h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{description}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/contact" className="brand-btn-gold brand-btn">
            Nous contacter
          </Link>
        </div>
      </div>
    </div>
  );
}
