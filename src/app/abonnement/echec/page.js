'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function AbonnementEchecPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="brand-card p-10 max-w-md w-full text-center"
      >
        <p className="text-4xl mb-4">❌</p>
        <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--brand-white)' }}>
          Paiement annulé ou refusé
        </h1>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          Le paiement n'a pas pu être finalisé. Aucun montant n'a été débité.
        </p>
        <Link href="/abonnement">
          <button className="brand-btn w-full justify-center">Réessayer →</button>
        </Link>
      </motion.div>
    </div>
  )
}
