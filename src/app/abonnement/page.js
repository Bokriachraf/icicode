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
  suspendu: { text: '⏳ En attente', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
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

  const [formations, setFormations] = useState([]) // [{ niveauId, niveauNom, formationNom, plans, abonnement }]
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
      const [inscRes, abRes, payRes] = await Promise.all([
        Axios.get(`${API}/api/inscription/mine`, cfg).catch(() => ({ data: [] })),
        Axios.get(`${API}/api/abonnements/mes`, cfg).catch(() => ({ data: [] })),
        Axios.get(`${API}/api/paiements/mes`, cfg).catch(() => ({ data: [] })),
      ])

      const inscriptions = Array.isArray(inscRes.data) ? inscRes.data : []
      const abonnements  = Array.isArray(abRes.data) ? abRes.data : []
      setPaiements(Array.isArray(payRes.data) ? payRes.data : [])

      // Formations validées, dédupliquées par COUPLE (niveau + formation) — un même
      // niveau scolaire (ex: "4ème lycée") peut correspondre à plusieurs formations
      // différentes (Gaming, Mathématiques & Python, Management...), ce sont des
      // parcours indépendants qui ne doivent jamais partager le même abonnement/plan.
      const validees = inscriptions.filter(i => i.status === 'Validé' && i.niveauId)
      const parFormation = new Map()
      for (const insc of validees) {
        const cle = `${insc.niveauId._id}::${insc.formation}`
        if (!parFormation.has(cle)) {
          parFormation.set(cle, { niveauId: insc.niveauId._id, niveauNom: insc.niveauId.nom, formationNom: insc.formation })
        }
      }

      // Pour chaque formation validée : ses plans (filtrés niveau + formation) + son abonnement le plus pertinent
      const enrichies = await Promise.all(
        Array.from(parFormation.values()).map(async (f) => {
          const { data: plans } = await Axios.get(
            `${API}/api/plans?niveauId=${f.niveauId}&formation=${encodeURIComponent(f.formationNom)}`
          )
          const abosDeCetteFormation = abonnements.filter(a => {
            const planNiveauId = (a.planId?.niveauId?._id || a.planId?.niveauId)?.toString()
            return planNiveauId === f.niveauId && a.planId?.formation === f.formationNom
          })
          const actif = abosDeCetteFormation.find(a => a.statut === 'actif')
          const enAttente = abosDeCetteFormation.find(a => a.statut === 'suspendu')
          return {
            ...f,
            plans: Array.isArray(plans) ? plans : [],
            abonnement: actif || enAttente || null,
          }
        })
      )

      setFormations(enrichies)
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
        window.location.href = data.link
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

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 md:px-10 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--brand-white)' }}>
          Mes abonnements
        </h1>
        <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>
          Une formation = un abonnement. Gérez chacune indépendamment.
        </p>
      </motion.div>

      {msg && (
        <div className={`mb-6 px-4 py-3 rounded-xl text-sm border ${msg.startsWith('ℹ️') ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : msg.startsWith('✅') ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
          {msg}
        </div>
      )}

      {loading ? (
        <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>Chargement...</div>
      ) : formations.length === 0 ? (
        <div className="brand-card p-8 text-center">
          <p className="text-3xl mb-2">📦</p>
          <p style={{ color: 'var(--text-secondary)' }}>
            Aucune formation validée pour l'instant. Une fois qu'un administrateur aura validé votre inscription, elle apparaîtra ici.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-8 mb-10">
          {formations.map((f) => {
            const abo = f.abonnement
            const actif = abo?.statut === 'actif'
            const joursRestants = abo ? Math.ceil((new Date(abo.dateEcheance) - new Date()) / (1000 * 60 * 60 * 24)) : null

            return (
              <div key={`${f.niveauId}-${f.formationNom}`} className="brand-card p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-5">
                  <div>
                    <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>{f.formationNom}</p>
                    <h2 className="text-lg font-bold" style={{ color: 'var(--brand-white)' }}>{f.niveauNom}</h2>
                  </div>
                  {abo && (
                    <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${statutLabel[abo.statut]?.color}`}>
                      {statutLabel[abo.statut]?.text}
                    </span>
                  )}
                </div>

                {actif ? (
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Échéance : {new Date(abo.dateEcheance).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    {joursRestants > 0 && ` · ${joursRestants} jour(s) restant(s)`}
                    {joursRestants <= 7 && <span className="ml-2 text-amber-400">⚠️ Renouvellement bientôt nécessaire</span>}
                  </p>
                ) : abo?.statut === 'suspendu' ? (
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Votre demande de paiement est en attente de confirmation par un administrateur.
                  </p>
                ) : f.plans.length === 0 ? (
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Aucun plan disponible pour cette formation actuellement.
                  </p>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {f.plans.map((p) => (
                      <div key={p._id} className="rounded-xl p-4 flex flex-col gap-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <h3 className="font-bold text-sm" style={{ color: 'var(--brand-white)' }}>{p.nom}</h3>
                        <div>
                          <span className="text-xl font-bold" style={{ color: 'var(--brand-cyan)' }}>{p.prix}</span>
                          <span className="text-xs" style={{ color: 'var(--text-muted)' }}> TND/mois</span>
                        </div>
                        {p.description && (
                          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{p.description}</p>
                        )}

                        {FLOUCI_ENABLED && (
                          <button onClick={() => payer(p._id)} disabled={paying === p._id} className="brand-btn w-full justify-center">
                            {paying === p._id ? 'Redirection...' : '💳 Payer avec Flouci'}
                          </button>
                        )}

                        {virementOuvert === p._id ? (
                          <div className="rounded-lg p-3 flex flex-col gap-2" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <div className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                              <p><strong style={{ color: 'var(--brand-white)' }}>Titulaire :</strong> {RIB_TITULAIRE}</p>
                              {RIB_BANQUE && <p><strong style={{ color: 'var(--brand-white)' }}>Banque :</strong> {RIB_BANQUE}</p>}
                              <p><strong style={{ color: 'var(--brand-white)' }}>RIB :</strong> {RIB}</p>
                              <p className="mt-1"><strong style={{ color: 'var(--brand-white)' }}>Montant :</strong> {p.prix} TND</p>
                            </div>
                            <input
                              type="text" value={reference} onChange={(e) => setReference(e.target.value)}
                              placeholder="Référence (optionnel)"
                              className="w-full rounded-lg px-3 py-2 text-xs"
                              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'var(--brand-white)' }}
                            />
                            <button onClick={() => demanderVirement(p._id)} disabled={envoiVirement} className="brand-btn w-full justify-center text-xs py-2">
                              {envoiVirement ? 'Envoi...' : "J'ai effectué le virement →"}
                            </button>
                            <button onClick={() => setVirementOuvert(null)} className="text-xs" style={{ color: 'var(--text-muted)' }}>Annuler</button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setVirementOuvert(p._id)}
                            className="w-full justify-center text-xs py-2.5"
                            style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--brand-white)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '0.6rem', fontWeight: 600 }}
                          >
                            🏦 Payer par virement (RIB)
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Historique global des paiements, toutes formations confondues */}
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
                  {p.abonnementId?.planId?.niveauId?.nom ? `${p.abonnementId.planId.niveauId.nom} — ` : ''}
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
    </div>
  )
}
