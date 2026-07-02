'use client'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import Axios from 'axios'

const API = process.env.NEXT_PUBLIC_API_URL

export default function CreateSeancePage() {
  const router = useRouter()
  const { userInfo } = useSelector((s) => s.userSignin || {})

  const [niveaux,   setNiveaux]   = useState([])
  const [chapitres, setChapitres] = useState([])
  const [saving,    setSaving]    = useState(false)
  const [msg,       setMsg]       = useState(null)

  const [form, setForm] = useState({
    niveauId:   '',
    chapitreId: '',
    titre:      '',
    dateHeure:  '',
    duree:      60,
  })

  useEffect(() => {
    if (!userInfo?.isAdmin && userInfo?.role !== 'prof') { router.push('/'); return }
    Axios.get(`${API}/api/niveaux`).then(r => setNiveaux(r.data))
  }, [])

  useEffect(() => {
    if (!form.niveauId) { setChapitres([]); return }
    Axios.get(`${API}/api/chapitres?niveauId=${form.niveauId}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    }).then(r => setChapitres(r.data))
  }, [form.niveauId])

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.niveauId || !form.titre || !form.dateHeure) {
      return setMsg('❌ Niveau, titre et date sont obligatoires.')
    }
    setSaving(true)
    try {
      await Axios.post(`${API}/api/seances`, form, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      })
      setMsg('✅ Séance planifiée !')
      setTimeout(() => router.push('/admin/seances'), 1000)
    } catch {
      setMsg('❌ Erreur lors de la création.')
    }
    setSaving(false)
  }

  const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

  const college = niveaux.filter(n => n.categorie === 'college')
  const lycee   = niveaux.filter(n => n.categorie === 'lycee')
  const univ    = niveaux.filter(n => n.categorie === 'universite')

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <button onClick={() => router.back()} className="text-sm text-indigo-600 hover:underline mb-2">← Retour</button>
        <h1 className="text-2xl font-bold text-gray-800">Planifier une séance</h1>
      </div>

      {msg && (
        <div className={`mb-4 px-4 py-2 rounded-lg text-sm ${msg.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">

        <div>
          <label className={labelClass}>Niveau *</label>
          <select value={form.niveauId} onChange={e => set('niveauId', e.target.value)} className={inputClass}>
            <option value="">-- Choisir un niveau --</option>
            {college.length > 0 && <optgroup label="Collège">{college.map(n => <option key={n._id} value={n._id}>{n.nom}</option>)}</optgroup>}
            {lycee.length > 0   && <optgroup label="Lycée">{lycee.map(n => <option key={n._id} value={n._id}>{n.nom}</option>)}</optgroup>}
            {univ.length > 0    && <optgroup label="Université">{univ.map(n => <option key={n._id} value={n._id}>{n.nom}</option>)}</optgroup>}
          </select>
        </div>

        <div>
          <label className={labelClass}>Chapitre lié (optionnel)</label>
          <select value={form.chapitreId} onChange={e => set('chapitreId', e.target.value)} className={inputClass} disabled={!form.niveauId}>
            <option value="">-- Aucun chapitre --</option>
            {chapitres.map(c => <option key={c._id} value={c._id}>{c.ordre}. {c.titre}</option>)}
          </select>
        </div>

        <div>
          <label className={labelClass}>Titre de la séance *</label>
          <input type="text" value={form.titre} onChange={e => set('titre', e.target.value)} className={inputClass} placeholder="Ex: Séance 1 — Suites réelles" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Date et heure *</label>
            <input type="datetime-local" value={form.dateHeure} onChange={e => set('dateHeure', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Durée (minutes)</label>
            <input type="number" min="15" step="15" value={form.duree} onChange={e => set('duree', parseInt(e.target.value))} className={inputClass} />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl transition text-sm">
            {saving ? 'Planification...' : '📅 Planifier la séance'}
          </button>
          <button type="button" onClick={() => router.back()}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-2.5 rounded-xl transition text-sm">
            Annuler
          </button>
        </div>
      </form>
    </div>
  )
}
