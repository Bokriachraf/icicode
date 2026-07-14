'use client'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import Axios from 'axios'

const API = process.env.NEXT_PUBLIC_API_URL

export default function AdminPlansPage() {
  const router = useRouter()
  const { userInfo } = useSelector((s) => s.userSignin || {})

  const [plans,   setPlans]   = useState([])
  const [niveaux, setNiveaux] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing,  setEditing]  = useState(null)
  const [saving,   setSaving]   = useState(false)
  const [msg,      setMsg]      = useState(null)

  const emptyForm = { nom: '', formation: '', niveauId: '', prix: '', dureeEngagement: 1, description: '', actif: true }
  const [form, setForm] = useState(emptyForm)

  const FORMATIONS = [
    'Développement Web',
    'Développement Mobile',
    'IA & Machine Learning',
    'Data Science',
    'Data Analysis',
    'Mathématiques & Python',
    'Gaming',
    'Digital Marketing',
    'Management',
  ]

  const cfg = { headers: { Authorization: `Bearer ${userInfo?.token}` } }

  useEffect(() => {
    if (!userInfo?.isAdmin) { router.push('/'); return }
    Promise.all([
      Axios.get(`${API}/api/plans/admin`, cfg),
      Axios.get(`${API}/api/niveaux`),
    ]).then(([pRes, nRes]) => {
      setPlans(pRes.data)
      setNiveaux(nRes.data)
      setLoading(false)
    })
  }, [])

  const setF = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.niveauId || !form.formation || !form.prix || !form.nom) return setMsg('❌ Remplissez tous les champs obligatoires.')
    setSaving(true)
    try {
      if (editing) {
        const { data } = await Axios.put(`${API}/api/plans/${editing}`, form, cfg)
        setPlans(prev => prev.map(p => p._id === editing ? data : p))
        setMsg('✅ Plan mis à jour !')
      } else {
        const { data } = await Axios.post(`${API}/api/plans`, form, cfg)
        setPlans(prev => [data, ...prev])
        setMsg('✅ Plan créé !')
      }
      setForm(emptyForm)
      setShowForm(false)
      setEditing(null)
    } catch { setMsg('❌ Erreur.') }
    setSaving(false)
  }

  const editPlan = (p) => {
    setForm({ nom: p.nom, formation: p.formation || '', niveauId: p.niveauId?._id || p.niveauId, prix: p.prix, dureeEngagement: p.dureeEngagement, description: p.description || '', actif: p.actif })
    setEditing(p._id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleActif = async (p) => {
    const { data } = await Axios.put(`${API}/api/plans/${p._id}`, { actif: !p.actif }, cfg)
    setPlans(prev => prev.map(pl => pl._id === p._id ? data : pl))
  }

  const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

  const college = niveaux.filter(n => n.categorie === 'college')
  const lycee   = niveaux.filter(n => n.categorie === 'lycee')
  const univ    = niveaux.filter(n => n.categorie === 'universite')

  const categorieLabel = { college: 'Collège', lycee: 'Lycée', universite: 'Université' }
  const categorieColor = { college: 'bg-indigo-50 text-indigo-700', lycee: 'bg-amber-50 text-amber-700', universite: 'bg-green-50 text-green-700' }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Plans tarifaires</h1>
          <p className="text-gray-500 text-sm mt-1">{plans.filter(p => p.actif).length} plans actifs</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm(emptyForm) }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition">
          {showForm ? 'Annuler' : '+ Nouveau plan'}
        </button>
      </div>

      {msg && (
        <div className={`mb-4 px-4 py-2 rounded-lg text-sm ${msg.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}
          onClick={() => setMsg(null)}>
          {msg}
        </div>
      )}

      {/* Formulaire */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-indigo-100 shadow-sm p-6 mb-6 space-y-4">
          <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
            {editing ? 'Modifier le plan' : 'Nouveau plan'}
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Nom *</label>
              <input type="text" value={form.nom} onChange={e => setF('nom', e.target.value)} className={inputClass} placeholder="Ex: BAC Math & Python" />
            </div>
            <div>
              <label className={labelClass}>Formation *</label>
              <select value={form.formation} onChange={e => setF('formation', e.target.value)} className={inputClass}>
                <option value="">-- Choisir --</option>
                {FORMATIONS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Niveau *</label>
              <select value={form.niveauId} onChange={e => setF('niveauId', e.target.value)} className={inputClass}>
                <option value="">-- Choisir --</option>
                {college.length > 0 && <optgroup label="Collège">{college.map(n => <option key={n._id} value={n._id}>{n.nom}</option>)}</optgroup>}
                {lycee.length > 0   && <optgroup label="Lycée">{lycee.map(n => <option key={n._id} value={n._id}>{n.nom}</option>)}</optgroup>}
                {univ.length > 0    && <optgroup label="Université">{univ.map(n => <option key={n._id} value={n._id}>{n.nom}</option>)}</optgroup>}
              </select>
            </div>
            <div>
              <label className={labelClass}>Prix (TND/mois) *</label>
              <input type="number" min="1" value={form.prix} onChange={e => setF('prix', parseInt(e.target.value))} className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Durée d'engagement</label>
            <select value={form.dureeEngagement} onChange={e => setF('dureeEngagement', parseInt(e.target.value))} className={inputClass}>
              <option value={1}>1 mois</option>
              <option value={3}>3 mois</option>
              <option value={6}>6 mois</option>
              <option value={12}>12 mois</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea value={form.description} onChange={e => setF('description', e.target.value)} rows={2} className={inputClass} placeholder="Ce que comprend le plan..." />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={saving}
              className="bg-indigo-600 text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-indigo-700 transition">
              {saving ? 'Enregistrement...' : editing ? '💾 Mettre à jour' : '✅ Créer le plan'}
            </button>
          </div>
        </form>
      )}

      {/* Liste plans groupés par catégorie */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">Chargement...</div>
      ) : (
        ['college', 'lycee', 'universite'].map(cat => {
          const plansCat = plans.filter(p => p.niveauId?.categorie === cat)
          if (!plansCat.length) return null
          return (
            <div key={cat} className="mb-8">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                {categorieLabel[cat]}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {plansCat.map(p => (
                  <div key={p._id} className={`rounded-2xl border-2 p-5 ${p.actif ? 'border-gray-100 bg-white' : 'border-gray-100 bg-gray-50 opacity-60'}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categorieColor[p.niveauId?.categorie]}`}>
                          {p.niveauId?.nom}
                        </span>
                        {p.formation && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 ml-1">
                            {p.formation}
                          </span>
                        )}
                        <h3 className="font-bold text-gray-800 mt-2">{p.nom}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-indigo-700">{p.prix}</p>
                        <p className="text-xs text-gray-400">TND/mois</p>
                      </div>
                    </div>
                    {p.description && <p className="text-xs text-gray-500 mb-3 leading-relaxed">{p.description}</p>}
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={() => editPlan(p)}
                        className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition font-medium">
                        Modifier
                      </button>
                      <button onClick={() => toggleActif(p)}
                        className={`text-xs px-3 py-1.5 rounded-lg transition font-medium ${p.actif ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}>
                        {p.actif ? 'Désactiver' : 'Activer'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
