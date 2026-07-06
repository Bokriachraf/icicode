'use client'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter, useSearchParams } from 'next/navigation'
import Axios from 'axios'

const API = process.env.NEXT_PUBLIC_API_URL

export default function CreateExercicePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { userInfo } = useSelector((s) => s.userSignin || {})

  const [chapitres, setChapitres] = useState([])
  const [saving, setSaving]       = useState(false)
  const [msg, setMsg]             = useState(null)

  const [form, setForm] = useState({
    chapitreId: searchParams.get('chapitreId') || '',
    type_partie: 'math',
    type: 'qcm',
    enonce: '',
    options: ['', ''],
    reponseAttendue: '',
    codeStarter: '',
    validation: 'auto',
    scoreMax: 10,
    ordre: 1,
  })

  useEffect(() => {
    if (!userInfo?.isAdmin && userInfo?.role !== 'prof') { router.push('/'); return }
    // On charge tous les chapitres (tous niveaux) pour permettre de changer le chapitre cible si besoin
    Axios.get(`${API}/api/niveaux`).then(async ({ data: niveauxData }) => {
      const niveaux = Array.isArray(niveauxData) ? niveauxData : []
      const all = await Promise.all(
        niveaux.map(n =>
          Axios.get(`${API}/api/chapitres?niveauId=${n._id}`, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          })
            .then(r => (Array.isArray(r.data) ? r.data : []).map(c => ({ ...c, niveauNom: n.nom })))
            .catch(() => [])
        )
      )
      setChapitres(all.flat())
    }).catch(e => { console.error(e); setChapitres([]) })
  }, [])

  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  const setOption = (i, value) => {
    setForm(prev => {
      const options = [...prev.options]
      options[i] = value
      return { ...prev, options }
    })
  }
  const addOption = () => setForm(prev => ({ ...prev, options: [...prev.options, ''] }))
  const removeOption = (i) => setForm(prev => ({ ...prev, options: prev.options.filter((_, idx) => idx !== i) }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.chapitreId) return setMsg('❌ Choisissez un chapitre.')
    if (!form.enonce.trim()) return setMsg('❌ L\'énoncé est obligatoire.')
    if (form.type === 'qcm' && form.options.filter(o => o.trim()).length < 2) {
      return setMsg('❌ Un QCM nécessite au moins 2 options.')
    }

    const payload = {
      chapitreId: form.chapitreId,
      type_partie: form.type_partie,
      type: form.type,
      enonce: form.enonce,
      reponseAttendue: form.reponseAttendue,
      validation: form.validation,
      scoreMax: Number(form.scoreMax),
      ordre: Number(form.ordre),
      ...(form.type === 'qcm' ? { options: form.options.filter(o => o.trim()) } : {}),
      ...(form.type_partie === 'python' ? { codeStarter: form.codeStarter } : {}),
    }

    setSaving(true)
    try {
      await Axios.post(`${API}/api/exercices`, payload, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      })
      setMsg('✅ Exercice créé !')
      setTimeout(() => router.push(`/admin/exercices`), 1000)
    } catch (err) {
      setMsg('❌ Erreur lors de la création.')
    }
    setSaving(false)
  }

  const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-6">
        <button onClick={() => router.back()} className="text-sm text-indigo-600 hover:underline mb-2">← Retour</button>
        <h1 className="text-2xl font-bold text-gray-800">Nouvel exercice</h1>
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
            <label className={labelClass}>Chapitre *</label>
            <select value={form.chapitreId} onChange={e => set('chapitreId', e.target.value)} className={inputClass}>
              <option value="">-- Choisir un chapitre --</option>
              {[...chapitres]
                .sort((a, b) => a.niveauNom.localeCompare(b.niveauNom) || a.ordre - b.ordre)
                .map(c => (
                  <option key={c._id} value={c._id}>{c.niveauNom} — {c.ordre}. {c.titre}</option>
                ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Partie *</label>
              <select value={form.type_partie} onChange={e => set('type_partie', e.target.value)} className={inputClass}>
                <option value="math">📐 Math</option>
                <option value="python">🐍 Python</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Type d'exercice *</label>
              <select value={form.type} onChange={e => set('type', e.target.value)} className={inputClass}>
                <option value="qcm">QCM</option>
                <option value="completion">Complétion</option>
                <option value="projet_libre">Projet libre</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Énoncé *</label>
            <textarea value={form.enonce} onChange={e => set('enonce', e.target.value)} rows={3} className={inputClass} placeholder="Énoncé de l'exercice..." />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Ordre</label>
              <input type="number" min="1" value={form.ordre} onChange={e => set('ordre', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Score max</label>
              <input type="number" min="0" value={form.scoreMax} onChange={e => set('scoreMax', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Validation</label>
              <select value={form.validation} onChange={e => set('validation', e.target.value)} className={inputClass}>
                <option value="auto">Automatique</option>
                <option value="prof">Par le prof</option>
              </select>
            </div>
          </div>
        </div>

        {/* Options QCM */}
        {form.type === 'qcm' && (
          <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-6 space-y-3">
            <h2 className="font-semibold text-purple-700 text-sm uppercase tracking-wide">Options (QCM)</h2>
            {form.options.map((opt, i) => (
              <div key={i} className="flex gap-2">
                <input type="text" value={opt} onChange={e => setOption(i, e.target.value)} className={inputClass} placeholder={`Option ${i + 1}`} />
                {form.options.length > 2 && (
                  <button type="button" onClick={() => removeOption(i)} className="text-red-500 text-sm px-2">✕</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addOption} className="text-sm text-indigo-600 hover:underline">+ Ajouter une option</button>
          </div>
        )}

        {/* Réponse attendue (qcm + completion) */}
        {(form.type === 'qcm' || form.type === 'completion') && (
          <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-6 space-y-3">
            <h2 className="font-semibold text-green-700 text-sm uppercase tracking-wide">Correction automatique</h2>
            <div>
              <label className={labelClass}>Réponse attendue *</label>
              <input
                type="text"
                value={form.reponseAttendue}
                onChange={e => set('reponseAttendue', e.target.value)}
                className={inputClass}
                placeholder={form.type === 'qcm' ? 'Doit correspondre exactement à une des options' : 'Texte / valeur attendue'}
              />
            </div>
          </div>
        )}

        {/* Code starter (python) */}
        {form.type_partie === 'python' && (
          <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-6 space-y-3">
            <h2 className="font-semibold text-green-700 text-sm uppercase tracking-wide">🐍 Code de démarrage</h2>
            <textarea
              value={form.codeStarter}
              onChange={e => set('codeStarter', e.target.value)}
              rows={6}
              className={`${inputClass} font-mono`}
              placeholder="# Code Python affiché dans l'éditeur au démarrage..."
            />
          </div>
        )}

        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl transition text-sm">
            {saving ? 'Création...' : '✅ Créer l\'exercice'}
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
