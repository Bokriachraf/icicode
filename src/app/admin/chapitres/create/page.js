'use client'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter, useSearchParams } from 'next/navigation'
import Axios from 'axios'

const API = process.env.NEXT_PUBLIC_API_URL

export default function CreateChapitrePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { userInfo } = useSelector((s) => s.userSignin || {})

  const [niveaux, setNiveaux] = useState([])
  const [saving, setSaving]   = useState(false)
  const [msg, setMsg]         = useState(null)

  const [form, setForm] = useState({
    niveauId: searchParams.get('niveauId') || '',
    titre: '',
    ordre: 1,
    description: '',
    math: {
      contenu: '',
      videoUrl: '',
      fichierPdf: '',
    },
    python: {
      codeStarter: '# Écris ton code Python ici\n',
      consignes: '',
      debloquéApres: 'math',
    },
    actif: true,
  })

  useEffect(() => {
    if (!userInfo?.isAdmin && userInfo?.role !== 'prof') { router.push('/'); return }
    Axios.get(`${API}/api/niveaux`).then(r => setNiveaux(r.data))
  }, [])

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
    if (!form.niveauId) return setMsg('❌ Choisissez un niveau.')
    if (!form.titre)    return setMsg('❌ Le titre est obligatoire.')
    setSaving(true)
    try {
      await Axios.post(`${API}/api/chapitres`, form, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      })
      setMsg('✅ Chapitre créé !')
      setTimeout(() => router.push('/admin/chapitres'), 1000)
    } catch (e) {
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
    <div className="p-6 max-w-3xl">
      <div className="mb-6">
        <button onClick={() => router.back()} className="text-sm text-indigo-600 hover:underline mb-2">← Retour</button>
        <h1 className="text-2xl font-bold text-gray-800">Nouveau chapitre</h1>
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
            <label className={labelClass}>Niveau *</label>
            <select value={form.niveauId} onChange={e => set('niveauId', e.target.value)} className={inputClass}>
              <option value="">-- Choisir un niveau --</option>
              {college.length > 0 && <optgroup label="Collège">{college.map(n => <option key={n._id} value={n._id}>{n.nom}</option>)}</optgroup>}
              {lycee.length > 0   && <optgroup label="Lycée">{lycee.map(n => <option key={n._id} value={n._id}>{n.nom}</option>)}</optgroup>}
              {univ.length > 0    && <optgroup label="Université">{univ.map(n => <option key={n._id} value={n._id}>{n.nom}</option>)}</optgroup>}
            </select>
          </div>

          <div>
            <label className={labelClass}>Titre *</label>
            <input type="text" value={form.titre} onChange={e => set('titre', e.target.value)} className={inputClass} placeholder="Ex: Suites réelles" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Ordre (position)</label>
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
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2} className={inputClass} placeholder="Brève description du chapitre" />
          </div>
        </div>

        {/* Partie Math */}
        <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-purple-700 text-sm uppercase tracking-wide">📐 Partie Math</h2>

          <div>
            <label className={labelClass}>Contenu du cours (HTML ou texte)</label>
            <textarea value={form.math.contenu} onChange={e => set('math.contenu', e.target.value)} rows={6} className={inputClass} placeholder="Contenu HTML ou texte du cours mathématique..." />
          </div>

          <div>
            <label className={labelClass}>URL Vidéo (YouTube embed ou autre)</label>
            <input type="url" value={form.math.videoUrl} onChange={e => set('math.videoUrl', e.target.value)} className={inputClass} placeholder="https://www.youtube.com/embed/..." />
          </div>

          <div>
            <label className={labelClass}>URL PDF du cours</label>
            <input type="url" value={form.math.fichierPdf} onChange={e => set('math.fichierPdf', e.target.value)} className={inputClass} placeholder="https://..." />
          </div>
        </div>

        {/* Partie Python */}
        <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-green-700 text-sm uppercase tracking-wide">🐍 Partie Python</h2>

          <div>
            <label className={labelClass}>Consignes pour l'élève</label>
            <textarea value={form.python.consignes} onChange={e => set('python.consignes', e.target.value)} rows={3} className={inputClass} placeholder="Expliquez ce que l'élève doit faire en Python..." />
          </div>

          <div>
            <label className={labelClass}>Code de démarrage (affiché dans l'éditeur)</label>
            <textarea value={form.python.codeStarter} onChange={e => set('python.codeStarter', e.target.value)} rows={6} className={`${inputClass} font-mono`} placeholder="# Code Python de départ..." />
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl transition text-sm">
            {saving ? 'Création...' : '✅ Créer le chapitre'}
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
