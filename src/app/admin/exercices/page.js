'use client'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import Axios from 'axios'

const API = process.env.NEXT_PUBLIC_API_URL

const typeBadge = {
  qcm:          'bg-blue-100 text-blue-700',
  completion:   'bg-purple-100 text-purple-700',
  projet_libre: 'bg-orange-100 text-orange-700',
}

const typeLabel = {
  qcm:          'QCM',
  completion:   'Complétion',
  projet_libre: 'Projet libre',
}

export default function AdminExercicesPage() {
  const router = useRouter()
  const { userInfo } = useSelector((s) => s.userSignin || {})

  const [niveaux,   setNiveaux]   = useState([])
  const [chapitres, setChapitres] = useState([])
  const [exercices, setExercices] = useState([])
  const [niveauId,  setNiveauId]  = useState('')
  const [chapitreId, setChapitreId] = useState('')
  const [loading,   setLoading]   = useState(false)
  const [showForm,  setShowForm]  = useState(false)
  const [saving,    setSaving]    = useState(false)
  const [msg,       setMsg]       = useState(null)

  const emptyForm = {
    chapitreId: '', type_partie: 'python', type: 'qcm',
    enonce: '', options: ['', '', '', ''], reponseAttendue: '',
    codeStarter: '', validation: 'auto', scoreMax: 10, ordre: 0,
  }
  const [form, setForm] = useState(emptyForm)

  const cfg = { headers: { Authorization: `Bearer ${userInfo?.token}` } }

  useEffect(() => {
    if (!userInfo?.isAdmin && userInfo?.role !== 'prof') { router.push('/'); return }
    Axios.get(`${API}/api/niveaux`).then(r => setNiveaux(r.data))
  }, [])

  useEffect(() => {
    if (!niveauId) { setChapitres([]); setExercices([]); return }
    Axios.get(`${API}/api/chapitres?niveauId=${niveauId}`, cfg).then(r => {
      setChapitres(r.data)
      if (r.data.length > 0) setChapitreId(r.data[0]._id)
    })
  }, [niveauId])

  useEffect(() => {
    if (!chapitreId) { setExercices([]); return }
    setLoading(true)
    Axios.get(`${API}/api/exercices?chapitreId=${chapitreId}`, cfg)
      .then(r => setExercices(r.data))
      .finally(() => setLoading(false))
    setForm(prev => ({ ...prev, chapitreId }))
  }, [chapitreId])

  const setF = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.chapitreId) return setMsg('❌ Choisissez un chapitre.')
    if (!form.enonce)     return setMsg('❌ L\'énoncé est obligatoire.')
    setSaving(true)
    try {
      const payload = {
        ...form,
        options: form.type === 'qcm' ? form.options.filter(o => o.trim()) : [],
      }
      const { data } = await Axios.post(`${API}/api/exercices`, payload, cfg)
      setExercices(prev => [...prev, data])
      setForm({ ...emptyForm, chapitreId })
      setShowForm(false)
      setMsg('✅ Exercice créé !')
    } catch { setMsg('❌ Erreur lors de la création.') }
    setSaving(false)
  }

  const deleteEx = async (id) => {
    if (!confirm('Supprimer cet exercice ?')) return
    await Axios.delete(`${API}/api/exercices/${id}`, cfg)
    setExercices(prev => prev.filter(e => e._id !== id))
  }

  const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

  const college = niveaux.filter(n => n.categorie === 'college')
  const lycee   = niveaux.filter(n => n.categorie === 'lycee')
  const univ    = niveaux.filter(n => n.categorie === 'universite')

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Exercices</h1>
          <p className="text-gray-500 text-sm mt-1">Créer et gérer les exercices par chapitre</p>
        </div>
        {chapitreId && (
          <button onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition">
            + Nouvel exercice
          </button>
        )}
      </div>

      {msg && (
        <div className={`mb-4 px-4 py-2 rounded-lg text-sm ${msg.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}
          onClick={() => setMsg(null)}>
          {msg}
        </div>
      )}

      {/* Filtres */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 space-y-3">
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase mb-2">Niveau</p>
          <div className="flex flex-wrap gap-2">
            {[{ label: 'Collège', items: college }, { label: 'Lycée', items: lycee }, { label: 'Université', items: univ }].map(({ label, items }) => (
              <div key={label} className="flex flex-wrap gap-1 items-center">
                <span className="text-xs text-gray-400 mr-1">{label} :</span>
                {items.map(n => (
                  <button key={n._id} onClick={() => setNiveauId(n._id)}
                    className={`text-xs px-3 py-1.5 rounded-lg border-2 font-medium transition
                      ${niveauId === n._id ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                    {n.nom}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {chapitres.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase mb-2">Chapitre</p>
            <div className="flex flex-wrap gap-2">
              {chapitres.map(c => (
                <button key={c._id} onClick={() => setChapitreId(c._id)}
                  className={`text-xs px-3 py-1.5 rounded-lg border-2 font-medium transition
                    ${chapitreId === c._id ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                  {c.ordre}. {c.titre}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Formulaire création */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-indigo-100 shadow-sm p-6 mb-6 space-y-4">
          <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Nouvel exercice</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Partie</label>
              <select value={form.type_partie} onChange={e => setF('type_partie', e.target.value)} className={inputClass}>
                <option value="math">📐 Math</option>
                <option value="python">🐍 Python</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Type</label>
              <select value={form.type} onChange={e => { setF('type', e.target.value); setF('validation', e.target.value === 'projet_libre' ? 'prof' : 'auto') }} className={inputClass}>
                <option value="qcm">QCM</option>
                <option value="completion">Complétion de code</option>
                <option value="projet_libre">Projet libre</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Énoncé *</label>
            <textarea value={form.enonce} onChange={e => setF('enonce', e.target.value)} rows={3} className={inputClass} placeholder="Décrivez l'exercice..." />
          </div>

          {form.type === 'qcm' && (
            <div>
              <label className={labelClass}>Options (4 réponses)</label>
              {form.options.map((opt, i) => (
                <input key={i} type="text" value={opt}
                  onChange={e => { const o = [...form.options]; o[i] = e.target.value; setF('options', o) }}
                  className={`${inputClass} mb-2`} placeholder={`Option ${i + 1}`} />
              ))}
              <div>
                <label className={labelClass}>Bonne réponse</label>
                <input type="text" value={form.reponseAttendue} onChange={e => setF('reponseAttendue', e.target.value)} className={inputClass} placeholder="Copie la bonne option ici..." />
              </div>
            </div>
          )}

          {form.type === 'completion' && (
            <div className="space-y-2">
              <div>
                <label className={labelClass}>Code de départ (avec ___ à compléter)</label>
                <textarea value={form.codeStarter} onChange={e => setF('codeStarter', e.target.value)} rows={4} className={`${inputClass} font-mono`} placeholder="def calcul(n):\n    return ___" />
              </div>
              <div>
                <label className={labelClass}>Réponse attendue</label>
                <input type="text" value={form.reponseAttendue} onChange={e => setF('reponseAttendue', e.target.value)} className={inputClass} placeholder="n * 2" />
              </div>
            </div>
          )}

          {form.type === 'projet_libre' && (
            <div>
              <label className={labelClass}>Code de départ (optionnel)</label>
              <textarea value={form.codeStarter} onChange={e => setF('codeStarter', e.target.value)} rows={4} className={`${inputClass} font-mono`} />
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Score max</label>
              <input type="number" min="1" max="20" value={form.scoreMax} onChange={e => setF('scoreMax', parseInt(e.target.value))} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Ordre</label>
              <input type="number" min="0" value={form.ordre} onChange={e => setF('ordre', parseInt(e.target.value))} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Validation</label>
              <select value={form.validation} onChange={e => setF('validation', e.target.value)} className={inputClass}>
                <option value="auto">Automatique</option>
                <option value="prof">Par le prof</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="bg-indigo-600 text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-indigo-700 transition">
              {saving ? 'Création...' : '✅ Créer'}
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-xl hover:bg-gray-200 transition">
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* Liste exercices */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">Chargement...</div>
      ) : !chapitreId ? (
        <div className="text-center py-16 text-gray-400">Sélectionnez un niveau puis un chapitre.</div>
      ) : exercices.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-3xl mb-2">✏️</p>
          <p>Aucun exercice pour ce chapitre.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {exercices.map((ex, i) => (
            <div key={ex._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start justify-between gap-4">
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </div>
                <div>
                  <div className="flex gap-2 mb-1 flex-wrap">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${typeBadge[ex.type]}`}>
                      {typeLabel[ex.type]}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {ex.type_partie === 'python' ? '🐍 Python' : '📐 Math'}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {ex.validation === 'auto' ? '🤖 Auto' : '👨‍🏫 Prof'}
                    </span>
                    <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full">
                      {ex.scoreMax} pts
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{ex.enonce}</p>
                </div>
              </div>
              <button onClick={() => deleteEx(ex._id)}
                className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition font-medium flex-shrink-0">
                Supprimer
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
