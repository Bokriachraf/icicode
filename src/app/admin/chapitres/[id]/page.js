'use client'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter, useParams } from 'next/navigation'
import Axios from 'axios'

const API = process.env.NEXT_PUBLIC_API_URL

export default function EditChapitrePage() {
  const { id } = useParams()
  const router = useRouter()
  const { userInfo } = useSelector((s) => s.userSignin || {})

  const [niveaux, setNiveaux] = useState([])
  const [saving, setSaving]   = useState(false)
  const [loading, setLoading] = useState(true)
  const [msg, setMsg]         = useState(null)

  const [form, setForm] = useState(null)

  useEffect(() => {
    if (!userInfo?.isAdmin && userInfo?.role !== 'prof') { router.push('/'); return }
    Promise.all([
      Axios.get(`${API}/api/niveaux`).catch(() => ({ data: [] })),
      Axios.get(`${API}/api/chapitres/${id}`, { headers: { Authorization: `Bearer ${userInfo.token}` } }),
    ]).then(([nRes, cRes]) => {
      setNiveaux(Array.isArray(nRes.data) ? nRes.data : [])
      const c = cRes.data
      setForm({
        niveauId: c.niveauId?._id || c.niveauId || '',
        titre: c.titre || '',
        ordre: c.ordre || 1,
        description: c.description || '',
        actif: c.actif ?? true,
        math: {
          contenu:    c.math?.contenu    || '',
          videoUrl:   c.math?.videoUrl   || '',
          fichierPdf: c.math?.fichierPdf || '',
        },
        python: {
          codeStarter:    c.python?.codeStarter    || '# Écris ton code Python ici\n',
          consignes:      c.python?.consignes      || '',
          debloquéApres:  c.python?.debloquéApres  || 'math',
        },
      })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  const set = (path, value) => {
    const keys = path.split('.')
    setForm(prev => {
      const next = { ...prev }
      if (keys.length === 1) next[keys[0]] = value
      else next[keys[0]] = { ...next[keys[0]], [keys[1]]: value }
      return next
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMsg(null)
    try {
      await Axios.put(`${API}/api/chapitres/${id}`, form, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      })
      setMsg('✅ Chapitre mis à jour !')
    } catch {
      setMsg('❌ Erreur lors de la mise à jour.')
    }
    setSaving(false)
  }

  const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

  const college = niveaux.filter(n => n.categorie === 'college')
  const lycee   = niveaux.filter(n => n.categorie === 'lycee')
  const univ    = niveaux.filter(n => n.categorie === 'universite')

  if (loading) return <div className="p-6 text-gray-400">Chargement...</div>
  if (!form)   return <div className="p-6 text-red-500">Chapitre introuvable.</div>

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-6">
        <button onClick={() => router.back()} className="text-sm text-indigo-600 hover:underline mb-2">← Retour</button>
        <h1 className="text-2xl font-bold text-gray-800">Éditer le chapitre</h1>
        <p className="text-sm text-gray-500 mt-1">{form.titre}</p>
      </div>

      {msg && (
        <div className={`mb-4 px-4 py-2 rounded-lg text-sm ${msg.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Infos générales */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Informations générales</h2>

          <div>
            <label className={labelClass}>Niveau</label>
            <select value={form.niveauId} onChange={e => set('niveauId', e.target.value)} className={inputClass}>
              {college.length > 0 && <optgroup label="Collège">{college.map(n => <option key={n._id} value={n._id}>{n.nom}</option>)}</optgroup>}
              {lycee.length > 0   && <optgroup label="Lycée">{lycee.map(n => <option key={n._id} value={n._id}>{n.nom}</option>)}</optgroup>}
              {univ.length > 0    && <optgroup label="Université">{univ.map(n => <option key={n._id} value={n._id}>{n.nom}</option>)}</optgroup>}
            </select>
          </div>

          <div>
            <label className={labelClass}>Titre</label>
            <input type="text" value={form.titre} onChange={e => set('titre', e.target.value)} className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Ordre</label>
              <input type="number" min="1" value={form.ordre} onChange={e => set('ordre', parseInt(e.target.value))} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Python déverrouillé</label>
              <select value={form.python.debloquéApres} onChange={e => set('python.debloquéApres', e.target.value)} className={inputClass}>
                <option value="math">Après Math</option>
                <option value="immediat">Immédiatement</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2} className={inputClass} />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="actif" checked={form.actif} onChange={e => set('actif', e.target.checked)} />
            <label htmlFor="actif" className="text-sm text-gray-600">Chapitre actif (visible par les élèves)</label>
          </div>
        </div>

        {/* Partie Math */}
        <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-purple-700 text-sm uppercase tracking-wide">📐 Partie Math</h2>

          <div>
            <label className={labelClass}>Contenu du cours</label>
            <textarea value={form.math.contenu} onChange={e => set('math.contenu', e.target.value)} rows={8} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>URL Vidéo</label>
            <input type="url" value={form.math.videoUrl} onChange={e => set('math.videoUrl', e.target.value)} className={inputClass} placeholder="https://www.youtube.com/embed/..." />
            {form.math.videoUrl && (
              <div className="mt-2 rounded-lg overflow-hidden aspect-video">
                <iframe src={form.math.videoUrl} className="w-full h-full" allowFullScreen />
              </div>
            )}
          </div>

          <div>
            <label className={labelClass}>URL PDF</label>
            <input type="url" value={form.math.fichierPdf} onChange={e => set('math.fichierPdf', e.target.value)} className={inputClass} placeholder="https://..." />
          </div>
        </div>

        {/* Partie Python */}
        <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-green-700 text-sm uppercase tracking-wide">🐍 Partie Python</h2>

          <div>
            <label className={labelClass}>Consignes</label>
            <textarea value={form.python.consignes} onChange={e => set('python.consignes', e.target.value)} rows={3} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Code de démarrage</label>
            <textarea value={form.python.codeStarter} onChange={e => set('python.codeStarter', e.target.value)} rows={8} className={`${inputClass} font-mono`} />
          </div>
        </div>

        <div className="flex gap-3">
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
