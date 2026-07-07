'use client'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import Axios from 'axios'
import { motion } from 'framer-motion'

const API = process.env.NEXT_PUBLIC_API_URL

// Flouci masqué pour le moment (pas de compte configuré) — remettre à true une fois prêt
const FLOUCI_ENABLED = false

const RIB = process.env.NEXT_PUBLIC_RIB || 'TN59 XX XXX XXXXXXXXXXXXX XX'
const RIB_TITULAIRE = process.env.NEXT_PUBLIC_RIB_TITULAIRE || 'Codalog'
const RIB_BANQUE = process.env.NEXT_PUBLIC_RIB_BANQUE || ''

const statutLabel = {
  actif:    { text: '✅ Actif',    color: 'text-green-400 bg-green-500/10 border-green-500/30' },
  suspendu: { text: '⏸ Suspendu', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  expiré:   { text: '⛔ Expiré',   color: 'text-red-400 bg-red-500/10 border-red-500/30' },
  gratuit:  { text: '🎁 Gratuit',  color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
}

const paiementStatutLabel = {
  en_attente: '⏳ En attente',
  payé:       '✅ Payé',
  échoué:     '❌ Échoué',
  remboursé:  '↩️ Remboursé',
}

export default function AbonnementPage() {
  const router = useRouter()
  const { userInfo } = useSelector((s) => s.userSignin || {})

  const [abonnement, setAbonnement] = useState(null)
  const [plans,      setPlans]      = useState([])
  const [paiements,  setPaiements]  = useState([])
  const [loading,    setLoading]    = useState(true)
  const [paying,     setPaying]     = useState(null)
  const [msg,        setMsg]        = useState(null)
  const [virementOuvert, setVirementOuvert] = useState(null) // planId dont le panneau RIB est ouvert
  const [reference,      setReference]      = useState('')
  const [envoiVirement,  setEnvoiVirement]  = useState(false)

  useEffect(() => {
    if (!userInfo) { router.push('/signin'); return }
    fetchAll()
  }, [userInfo])

  const fetchAll = async () => {
    setLoading(true)
    const cfg = { headers: { Authorization: `Bearer ${userInfo.token}` } }
    try {
      const [aRes, pRes] = await Promise.all([
        Axios.get(`${API}/api/abonnements/mon`, cfg).catch(() => ({ data: null })),
        Axios.get(`${API}/api/paiements/mes`, cfg).catch(() => ({ data: [] })),
      ])
      setAbonnement(aRes.data || null)
      setPaiements(Array.isArray(pRes.data) ? pRes.data : [])

      if (userInfo.niveauId) {
        const { data } = await Axios.get(`${API}/api/plans?niveauId=${userInfo.niveauId}`)
        setPlans(Array.isArray(data) ? data : [])
      }
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  const payer = async (planId) => {
    setPaying(planId)
    setMsg(null)
    try {
      const cfg = { headers: { Authorization: `Bearer ${userInfo.token}` } }
      const { data } = await Axios.post(`${API}/api/paiements/flouci/init`, { planId }, cfg)
      if (data.link) {
        window.location.href = data.link // redirection vers Flouci
      } else {
        setMsg('❌ Impossible de générer le paiement.')
        setPaying(null)
      }
    } catch (e) {
      if (e.response?.data?.code === 'FLOUCI_NOT_CONFIGURED') {
        setMsg('ℹ️ Le paiement en ligne n\'est pas encore disponible. Utilisez le virement bancaire en attendant.')
      } else {
        setMsg('❌ Erreur lors de l\'initialisation du paiement.')
      }
      setPaying(null)
    }
  }

  const demanderVirement = async (planId) => {
    setEnvoiVirement(true)
    setMsg(null)
    try {
      const cfg = { headers: { Authorization: `Bearer ${userInfo.token}` } }
      await Axios.post(`${API}/api/paiements/virement/demander`, { planId, reference }, cfg)
      setMsg('✅ Demande enregistrée ! Effectuez le virement avec la référence ci-dessus, un administrateur activera votre abonnement dès réception.')
      setVirementOuvert(null)
      setReference('')
      fetchAll()
    } catch (e) {
      setMsg('❌ Erreur lors de l\'enregistrement de la demande.')
    }
    setEnvoiVirement(false)
  }

  if (!userInfo) return null

  const aUnAbonnementActif = abonnement && abonnement.statut === 'actif'
  const joursRestants = abonnement
    ? Math.ceil((new Date(abonnement.dateEcheance) - new Date()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 md:px-10 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--brand-white)' }}>
          Mon abonnement
        </h1>
        <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>
          Gérez votre abonnement et vos paiements
        </p>
      </motion.div>

      {msg && (
        <div className={`mb-6 px-4 py-3 rounded-xl text-sm border ${msg.startsWith('ℹ️') ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
          {msg}
        </div>
      )}

      {loading ? (
        <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>Chargement...</div>
      ) : (
        <>
          {/* Statut abonnement actuel */}
          <div className="brand-card p-6 mb-8">
            {abonnement ? (
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border mb-3 ${statutLabel[abonnement.statut]?.color}`}>
                    {statutLabel[abonnement.statut]?.text}
                  </span>
                  <h2 className="text-lg font-bold" style={{ color: 'var(--brand-white)' }}>
                    {abonnement.planId?.nom || 'Plan'}
                  </h2>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                    Échéance : {new Date(abonnement.dateEcheance).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    {aUnAbonnementActif && joursRestants > 0 && ` · ${joursRestants} jour(s) restant(s)`}
                  </p>
                </div>
                {aUnAbonnementActif && joursRestants <= 7 && (
                  <span className="text-xs font-medium px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    ⚠️ Renouvellement bientôt nécessaire
                  </span>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-3xl mb-2">📦</p>
                <p style={{ color: 'var(--text-secondary)' }}>Vous n'avez pas encore d'abonnement actif.</p>
              </div>
            )}
          </div>

          {/* Plans disponibles — affichés si pas d'abonnement actif */}
          {!aUnAbonnementActif && (
            <>
              <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--brand-white)' }}>
                Choisissez votre plan
              </h2>
              {plans.length === 0 ? (
                <div className="brand-card p-6 text-center mb-8" style={{ color: 'var(--text-muted)' }}>
                  {userInfo.niveauId
                    ? 'Aucun plan disponible pour votre niveau actuellement.'
                    : 'Complétez votre inscription pour voir les plans disponibles pour votre niveau.'}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {plans.map((p) => (
                    <div key={p._id} className="brand-card p-5 flex flex-col gap-3">
                      <h3 className="font-bold" style={{ color: 'var(--brand-white)' }}>{p.nom}</h3>
                      <div>
                        <span className="text-2xl font-bold" style={{ color: 'var(--brand-cyan)' }}>{p.prix}</span>
                        <span className="text-sm" style={{ color: 'var(--text-muted)' }}> TND/mois</span>
                      </div>
                      {p.description && (
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{p.description}</p>
                      )}

                      {FLOUCI_ENABLED && (
                        <button
                          onClick={() => payer(p._id)}
                          disabled={paying === p._id}
                          className="brand-btn w-full justify-center"
                        >
                          {paying === p._id ? 'Redirection...' : '💳 Payer avec Flouci'}
                        </button>
                      )}

                      {virementOuvert === p._id ? (
                        <div className="rounded-xl p-4 flex flex-col gap-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <div className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            <p><strong style={{ color: 'var(--brand-white)' }}>Titulaire :</strong> {RIB_TITULAIRE}</p>
                            {RIB_BANQUE && <p><strong style={{ color: 'var(--brand-white)' }}>Banque :</strong> {RIB_BANQUE}</p>}
                            <p><strong style={{ color: 'var(--brand-white)' }}>RIB :</strong> {RIB}</p>
                            <p className="mt-1"><strong style={{ color: 'var(--brand-white)' }}>Montant :</strong> {p.prix} TND</p>
                          </div>
                          <input
                            type="text"
                            value={reference}
                            onChange={(e) => setReference(e.target.value)}
                            placeholder="Référence du virement (optionnel)"
                            className="w-full rounded-lg px-3 py-2 text-sm"
                            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'var(--brand-white)' }}
                          />
                          <button
                            onClick={() => demanderVirement(p._id)}
                            disabled={envoiVirement}
                            className="brand-btn w-full justify-center"
                          >
                            {envoiVirement ? 'Envoi...' : "J'ai effectué le virement →"}
                          </button>
                          <button
                            onClick={() => setVirementOuvert(null)}
                            className="text-xs"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            Annuler
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setVirementOuvert(p._id)}
                          className="w-full justify-center mt-auto"
                          style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--brand-white)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '0.75rem', padding: '0.65rem 1rem', fontWeight: 600, fontSize: '0.875rem' }}
                        >
                          🏦 Payer par virement bancaire (RIB)
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Historique des paiements */}
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--brand-white)' }}>
            Historique des paiements
          </h2>
          {paiements.length === 0 ? (
            <div className="brand-card p-6 text-center" style={{ color: 'var(--text-muted)' }}>
              Aucun paiement enregistré pour le moment.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {paiements.map((p) => (
                <div key={p._id} className="brand-card p-4 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--brand-white)' }}>
                      {p.abonnementId?.planId?.nom || 'Plan'} — {p.montant} TND
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {new Date(p.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} · {p.methode}
                    </p>
                  </div>
                  <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>
                    {paiementStatutLabel[p.statut] || p.statut}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
