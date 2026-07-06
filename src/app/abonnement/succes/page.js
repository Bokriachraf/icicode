'use client'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Axios from 'axios'
import { motion } from 'framer-motion'

const API = process.env.NEXT_PUBLIC_API_URL

export default function AbonnementSuccesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { userInfo } = useSelector((s) => s.userSignin || {})

  const [statut, setStatut] = useState('verification') // verification | payé | échoué | erreur

  useEffect(() => {
    if (!userInfo) { router.push('/signin'); return }

    const paymentId = searchParams.get('payment_id')
    if (!paymentId) { setStatut('erreur'); return }

    Axios.get(`${API}/api/paiements/flouci/verify`, {
      params: { payment_id: paymentId },
      headers: { Authorization: `Bearer ${userInfo.token}` },
    })
      .then(({ data }) => setStatut(data.statut === 'payé' ? 'payé' : 'échoué'))
      .catch(() => setStatut('erreur'))
  }, [userInfo])

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="brand-card p-10 max-w-md w-full text-center"
      >
        {statut === 'verification' && (
          <>
            <p className="text-4xl mb-4">⏳</p>
            <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--brand-white)' }}>
              Vérification du paiement...
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Merci de patienter quelques secondes.
            </p>
          </>
        )}

        {statut === 'payé' && (
          <>
            <p className="text-4xl mb-4">✅</p>
            <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--brand-white)' }}>
              Paiement confirmé !
            </h1>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              Votre abonnement est maintenant actif. Vous pouvez accéder à tous vos cours.
            </p>
            <Link href="/dashboard">
              <button className="brand-btn w-full justify-center">Aller au tableau de bord →</button>
            </Link>
          </>
        )}

        {(statut === 'échoué' || statut === 'erreur') && (
          <>
            <p className="text-4xl mb-4">❌</p>
            <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--brand-white)' }}>
              Paiement non confirmé
            </h1>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              {statut === 'erreur'
                ? "Une erreur est survenue lors de la vérification."
                : "Le paiement n'a pas pu être validé."}
            </p>
            <Link href="/abonnement">
              <button className="brand-btn w-full justify-center">Réessayer →</button>
            </Link>
          </>
        )}
      </motion.div>
    </div>
  )
}
