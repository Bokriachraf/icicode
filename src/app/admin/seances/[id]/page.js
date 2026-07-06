'use client'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter, useParams } from 'next/navigation'
import Axios from 'axios'

const API = process.env.NEXT_PUBLIC_API_URL

export default function EditSeancePage() {
  const { id } = useParams()
  const router = useRouter()
  const { userInfo } = useSelector((s) => s.userSignin || {})

  const [niveaux,   setNiveaux]   = useState([])
  const [groupes,   setGroupes]   = useState([])
  const [chapitres, setChapitres] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [saving,    setSaving]    = useState(false)
  const [msg,       setMsg]       = useState(null)

  const [form, setForm] = useState(null)

  const cfg = { headers: { Authorization: `Bearer ${userInfo?.token}` } }

  useEffect(() => {
    if (!userInfo?.isAdmin && userInfo?.role !== 'prof') { router.push('/'); return }
    Promise.all([
      Axios.get(`${API}/api/niveaux`),
      Axios.get(`${API}/api/seances/${id}`, cfg),
    ]).then(([nRes, sRes]) => {
      setNiveaux(nRes.data)
      const s = sRes.data
      const niveauId = s.groupeId?.niveauId?._id || s.niveauId?._id || s.niveauId || ''
      setForm({
        niveauId,
        groupeId:   s.groupeId?._id || s.groupeId || '',
        chapitreId: s.chapitreId?._id || s.chapitreId || '',
        titre:      s.titre || '',
        dateHeure:  s.dateHeure ? new Date(s.dateHeure).toISOString().slice(0, 16) : '',
        duree:      s.duree || 60,
        statut:     s.statut || 'planifiée',
        replayUrl:  s.replayUrl || '',
      })
      // Charger groupes et chapitres du niveau
      if (niveauId) {
        Axios.get(`${API}/api/groupes?niveauId=${niveauId}`, cfg).then(r => setGroupes(r.data))
        Axios.get(`${API}/api/chapitres?niveauId=${niveauId}`, cfg).then(r => setChapitres(r.data))
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  // Recharger groupes/chapitres si niveau change
  useEffect(() => {
    if (!form?.niveauId) return
    Axios.get(`${API}/api/groupes?niveauId=${form.niveauId}`, cfg).then(r => setGroupes(r.data))
    Axios.get(`${API}/api/chapitres?niveauId=${form.niveauId}`, cfg).then(r => setChapitres(r.data))
  }, [form?.niveauId])

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.titre)     return setMsg('❌ Le titre est obligatoire.')
    if (!form.dateHeure) return setMsg('❌ La date est obligatoire.')
    setSaving(true)
    try {
      await Axios.put(`${API}/api/seances/${id}`, {
        groupeId:   form.groupeId   || undefined,
        chapitreId: form.chapitreId || undefined,
        titre:      form.titre,
        dateHeure:  form.dateHeure,
        duree:      form.duree,
        statut:     form.statut,
        replayUrl:  form.replayUrl  || undefined,
      }, cfg)
      setMsg('✅ Séance mise à jour !')
      setTimeout(() => router.push('/admin/seances'), 1200)
    } catch { setMsg('❌ Erreur lors de la mise à jour.') }
    setSaving(false)
  }

  const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

  const college = niveaux.filter(n => n.categorie === 'college')
  const lycee   = niveaux.filter(n => n.categorie === 'lycee')
  const univ    = niveaux.filter(n => n.categorie === 'universite')

  if (loading) return <div className="p-6 text-gray-400">Chargement...</div>
  if (!form)   return <div className="p-6 text-red-500">Séance introuvable.</div>

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <button onClick={() => router.back()} className="text-sm text-indigo-600 hover:underline mb-2">← Retour</button>
        <h1 className="text-2xl font-bold text-gray-800">Éditer la séance</h1>
        <p className="text-sm text-gray-500 mt-1">{form.titre}</p>
      </div>

      {msg && (
        <div className={`mb-4 px-4 py-2 rounded-lg text-sm ${msg.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">

        {/* Niveau */}
        <div>
          <label className={labelClass}>Niveau</label>
          <select value={form.niveauId} onChange={e => { set('niveauId', e.target.value); set('groupeId', ''); set('chapitreId', '') }} className={inputClass}>
            <option value="">-- Choisir un niveau --</option>
            {college.length > 0 && <optgroup label="Collège">{college.map(n => <option key={n._id} value={n._id}>{n.nom}</option>)}</optgroup>}
            {lycee.length > 0   && <optgroup label="Lycée">{lycee.map(n => <option key={n._id} value={n._id}>{n.nom}</option>)}</optgroup>}
            {univ.length > 0    && <optgroup label="Université">{univ.map(n => <option key={n._id} value={n._id}>{n.nom}</option>)}</optgroup>}
          </select>
        </div>

        {/* Groupe */}
        <div>
          <label className={labelClass}>Groupe</label>
          {groupes.length === 0 ? (
            <p className="text-xs text-gray-400 italic">Aucun groupe pour ce niveau.</p>
          ) : (
            <select value={form.groupeId} onChange={e => set('groupeId', e.target.value)} className={inputClass}>
              <option value="">-- Aucun groupe --</option>
              {groupes.map(g => <option key={g._id} value={g._id}>{g.nom} ({g.eleves?.length || 0} élèves)</option>)}
            </select>
          )}
        </div>

        {/* Chapitre */}
        <div>
          <label className={labelClass}>Chapitre lié (optionnel)</label>
          <select value={form.chapitreId} onChange={e => set('chapitreId', e.target.value)} className={inputClass}>
            <option value="">-- Aucun chapitre --</option>
            {chapitres.map(c => <option key={c._id} value={c._id}>{c.ordre}. {c.titre}</option>)}
          </select>
        </div>

        {/* Titre */}
        <div>
          <label className={labelClass}>Titre *</label>
          <input type="text" value={form.titre} onChange={e => set('titre', e.target.value)} className={inputClass} />
        </div>

        {/* Date + Durée */}
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

        {/* Statut */}
        <div>
          <label className={labelClass}>Statut</label>
          <select value={form.statut} onChange={e => set('statut', e.target.value)} className={inputClass}>
            <option value="planifiée">📅 Planifiée</option>
            <option value="en_cours">🔴 En cours</option>
            <option value="terminée">✅ Terminée</option>
            <option value="annulée">❌ Annulée</option>
          </select>
        </div>

        {/* Replay URL */}
        {(form.statut === 'terminée') && (
          <div>
            <label className={labelClass}>URL Replay</label>
            <input type="url" value={form.replayUrl} onChange={e => set('replayUrl', e.target.value)}
              className={inputClass} placeholder="https://www.youtube.com/embed/..." />
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl transition text-sm">
            {saving ? 'Enregistrement...' : '💾 Enregistrer'}
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
