'use client'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import Axios from 'axios'

const API = process.env.NEXT_PUBLIC_API_URL

const statutBadge = {
  en_attente: 'bg-blue-50 text-blue-700 border-blue-200',
  payé:       'bg-green-50 text-green-700 border-green-200',
  échoué:     'bg-red-50 text-red-600 border-red-200',
  remboursé:  'bg-gray-100 text-gray-500 border-gray-200',
}

const methodeBadge = {
  flouci:    'bg-purple-50 text-purple-700',
  virement:  'bg-blue-50 text-blue-700',
  especes:   'bg-amber-50 text-amber-700',
}

export default function AdminPaiementsPage() {
  const router = useRouter()
  const { userInfo } = useSelector((s) => s.userSignin || {})

  const [paiements, setPaiements] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [filtre,    setFiltre]    = useState('tous')
  const [action,    setAction]    = useState(null)
  const [note,      setNote]      = useState('')
  const [saving,    setSaving]    = useState(false)
  const [msg,       setMsg]       = useState(null)

  // Paiement manuel
  const [showManuel, setShowManuel] = useState(false)
  const [niveaux,    setNiveaux]    = useState([])
  const [plans,      setPlans]      = useState([])
  const [users,      setUsers]      = useState([])
  const [formManuel, setFormManuel] = useState({ eleveId: '', planId: '', methode: 'especes', note: '', dureesMois: 1 })

  const cfg = { headers: { Authorization: `Bearer ${userInfo?.token}` } }

  useEffect(() => {
    if (!userInfo?.isAdmin) { router.push('/'); return }
    fetchAll()
  }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [pRes, nRes, plRes, uRes] = await Promise.all([
        Axios.get(`${API}/api/paiements/admin`, cfg),
        Axios.get(`${API}/api/niveaux`),
        Axios.get(`${API}/api/plans/admin`, cfg),
        Axios.get(`${API}/api/admin/users`, cfg),
      ])
      setPaiements(pRes.data)
      setNiveaux(nRes.data)
      setPlans(plRes.data)
      setUsers(uRes.data.filter(u => !u.isAdmin))
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const confirmer = async (id) => {
    setSaving(true)
    try {
      await Axios.put(`${API}/api/paiements/${id}/confirmer`, { note }, cfg)
      setMsg('✅ Paiement confirmé et abonnement activé !')
      setAction(null)
      setNote('')
      fetchAll()
    } catch { setMsg('❌ Erreur.') }
    setSaving(false)
  }

  const rembourser = async (id) => {
    setSaving(true)
    try {
      await Axios.put(`${API}/api/paiements/${id}/rembourser`, { note }, cfg)
      setMsg('✅ Paiement remboursé.')
      setAction(null)
      setNote('')
      fetchAll()
    } catch { setMsg('❌ Erreur.') }
    setSaving(false)
  }

  const ajouterManuel = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await Axios.post(`${API}/api/paiements/manuel`, formManuel, cfg)
      setMsg('✅ Paiement manuel enregistré et abonnement activé !')
      setShowManuel(false)
      setFormManuel({ eleveId: '', planId: '', methode: 'especes', note: '', dureesMois: 1 })
      fetchAll()
    } catch { setMsg('❌ Erreur.') }
    setSaving(false)
  }

  const filtrés = filtre === 'tous' ? paiements : paiements.filter(p => p.statut === filtre)

  const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

  const total = paiements.filter(p => p.statut === 'payé').reduce((s, p) => s + p.montant, 0)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Paiements</h1>
          <p className="text-gray-500 text-sm mt-1">
            {paiements.filter(p => p.statut === 'en_attente').length} en attente ·{' '}
            Total encaissé : <strong>{total} TND</strong>
          </p>
        </div>
        <button onClick={() => setShowManuel(!showManuel)}
          className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition">
          + Paiement manuel
        </button>
      </div>

      {msg && (
        <div className={`mb-4 px-4 py-2 rounded-lg text-sm ${msg.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}
          onClick={() => setMsg(null)}>
          {msg}
        </div>
      )}

      {/* Formulaire paiement manuel */}
      {showManuel && (
        <form onSubmit={ajouterManuel} className="bg-white rounded-2xl border border-green-100 shadow-sm p-6 mb-6 space-y-4">
          <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Enregistrer un paiement manuel</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Élève *</label>
              <select value={formManuel.eleveId} onChange={e => setFormManuel(p => ({ ...p, eleveId: e.target.value }))} className={inputClass}>
                <option value="">-- Choisir un élève --</option>
                {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Plan *</label>
              <select value={formManuel.planId} onChange={e => setFormManuel(p => ({ ...p, planId: e.target.value }))} className={inputClass}>
                <option value="">-- Choisir un plan --</option>
                {plans.filter(p => p.actif).map(p => <option key={p._id} value={p._id}>{p.nom} — {p.prix} TND</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Méthode</label>
              <select value={formManuel.methode} onChange={e => setFormManuel(p => ({ ...p, methode: e.target.value }))} className={inputClass}>
                <option value="especes">Espèces</option>
                <option value="virement">Virement</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Durée (mois)</label>
              <input type="number" min="1" max="12" value={formManuel.dureesMois}
                onChange={e => setFormManuel(p => ({ ...p, dureesMois: parseInt(e.target.value) }))} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Note</label>
              <input type="text" value={formManuel.note} onChange={e => setFormManuel(p => ({ ...p, note: e.target.value }))} className={inputClass} placeholder="Reçu N°..." />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving}
              className="bg-green-600 text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-green-700 transition">
              {saving ? 'Enregistrement...' : '✅ Confirmer le paiement'}
            </button>
            <button type="button" onClick={() => setShowManuel(false)}
              className="bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-xl hover:bg-gray-200 transition">
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* Filtres */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {['tous', 'en_attente', 'payé', 'échoué', 'remboursé'].map(f => (
          <button key={f} onClick={() => setFiltre(f)}
            className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition
              ${filtre === f ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
            {f === 'tous' ? `Tous (${paiements.length})` : `${f} (${paiements.filter(p => p.statut === f).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Chargement...</div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtrés.map(p => (
            <div key={p._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="space-y-1">
                  <div className="flex gap-2 flex-wrap">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${statutBadge[p.statut]}`}>
                      {p.statut}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${methodeBadge[p.methode]}`}>
                      {p.methode}
                    </span>
                  </div>
                  <p className="font-bold text-gray-800 text-lg">{p.montant} TND</p>
                  <p className="text-sm text-gray-600">
                    {p.eleveId?.name} · {p.eleveId?.email}
                  </p>
                  <p className="text-xs text-gray-400">
                    Plan : {p.abonnementId?.planId?.nom || '—'} ·{' '}
                    {new Date(p.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                  {p.note && <p className="text-xs text-gray-500 italic">Note : {p.note}</p>}
                </div>

                <div className="flex flex-col gap-2 flex-shrink-0">
                  {p.statut === 'en_attente' && (
                    <>
                      {action?.id === p._id && action?.type === 'confirmer' ? (
                        <div className="flex gap-2 items-center">
                          <input value={note} onChange={e => setNote(e.target.value)}
                            className="border rounded-lg px-2 py-1 text-xs text-gray-800 w-32" placeholder="Note..." />
                          <button onClick={() => confirmer(p._id)} disabled={saving}
                            className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg font-medium">
                            {saving ? '...' : 'OK'}
                          </button>
                          <button onClick={() => setAction(null)} className="text-xs text-gray-500">✕</button>
                        </div>
                      ) : (
                        <button onClick={() => setAction({ id: p._id, type: 'confirmer' })}
                          className="text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-100 transition font-medium">
                          ✅ Confirmer
                        </button>
                      )}
                    </>
                  )}
                  {p.statut === 'payé' && (
                    <>
                      {action?.id === p._id && action?.type === 'rembourser' ? (
                        <div className="flex gap-2 items-center">
                          <input value={note} onChange={e => setNote(e.target.value)}
                            className="border rounded-lg px-2 py-1 text-xs text-gray-800 w-32" placeholder="Raison..." />
                          <button onClick={() => rembourser(p._id)} disabled={saving}
                            className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg font-medium">
                            {saving ? '...' : 'OK'}
                          </button>
                          <button onClick={() => setAction(null)} className="text-xs text-gray-500">✕</button>
                        </div>
                      ) : (
                        <button onClick={() => setAction({ id: p._id, type: 'rembourser' })}
                          className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition font-medium">
                          Rembourser
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
