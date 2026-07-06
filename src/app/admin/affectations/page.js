'use client'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import Axios from 'axios'

const API = process.env.NEXT_PUBLIC_API_URL

export default function AdminAffectationsPage() {
  const router = useRouter()
  const { userInfo } = useSelector((s) => s.userSignin || {})

  const [niveaux,     setNiveaux]     = useState([])
  const [chapitres,   setChapitres]   = useState([])
  const [exercices,   setExercices]   = useState([])
  const [groupes,     setGroupes]     = useState([])
  const [seances,     setSeances]     = useState([])
  const [eleves,      setEleves]      = useState([])
  const [affectations, setAffectations] = useState([])

  const [niveauId,    setNiveauId]    = useState('')
  const [chapitreId,  setChapitreId]  = useState('')
  const [saving,      setSaving]      = useState(false)
  const [msg,         setMsg]         = useState(null)

  const [form, setForm] = useState({
    exerciceIds:  [],
    cible:        'groupe',
    seanceId:     '',
    groupeId:     '',
    eleveId:      '',
    dateEcheance: '',
  })

  const cfg = { headers: { Authorization: `Bearer ${userInfo?.token}` } }
  const setF = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  useEffect(() => {
    if (!userInfo?.isAdmin && userInfo?.role !== 'prof') { router.push('/'); return }
    Axios.get(`${API}/api/niveaux`).then(r => setNiveaux(r.data))
  }, [])

  useEffect(() => {
    if (!niveauId) { setChapitres([]); setGroupes([]); setSeances([]); setEleves([]); return }
    Promise.all([
      Axios.get(`${API}/api/chapitres?niveauId=${niveauId}`, cfg),
      Axios.get(`${API}/api/groupes?niveauId=${niveauId}`, cfg),
      Axios.get(`${API}/api/seances?niveauId=${niveauId}`, cfg),
    ]).then(([cRes, gRes, sRes]) => {
      setChapitres(cRes.data)
      setGroupes(gRes.data)
      setSeances(sRes.data)
      if (cRes.data.length > 0) setChapitreId(cRes.data[0]._id)
    })
  }, [niveauId])

  useEffect(() => {
    if (!chapitreId) { setExercices([]); return }
    Axios.get(`${API}/api/exercices?chapitreId=${chapitreId}`, cfg)
      .then(r => setExercices(r.data))
  }, [chapitreId])

  // Charger les élèves du groupe sélectionné
  useEffect(() => {
    if (form.cible !== 'eleve' || !form.groupeId) { setEleves([]); return }
    const g = groupes.find(g => g._id === form.groupeId)
    setEleves(g?.eleves || [])
  }, [form.groupeId, form.cible, groupes])

  // Charger les affectations existantes
  useEffect(() => {
    if (!chapitreId) return
    const params = new URLSearchParams()
    if (form.groupeId) params.set('groupeId', form.groupeId)
    if (form.seanceId) params.set('seanceId', form.seanceId)
    Axios.get(`${API}/api/affectations?${params}`, cfg).then(r => setAffectations(r.data))
  }, [chapitreId, form.groupeId, form.seanceId])

  const toggleEx = (id) => {
    setF('exerciceIds', form.exerciceIds.includes(id)
      ? form.exerciceIds.filter(e => e !== id)
      : [...form.exerciceIds, id]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.exerciceIds.length) return setMsg('❌ Sélectionnez au moins un exercice.')
    if (form.cible === 'groupe' && !form.groupeId) return setMsg('❌ Choisissez un groupe.')
    if (form.cible === 'seance' && !form.seanceId) return setMsg('❌ Choisissez une séance.')
    if (form.cible === 'eleve'  && !form.eleveId)  return setMsg('❌ Choisissez un élève.')

    setSaving(true)
    try {
      await Axios.post(`${API}/api/affectations/bulk`, form, cfg)
      setMsg(`✅ ${form.exerciceIds.length} exercice(s) affecté(s) !`)
      setForm(prev => ({ ...prev, exerciceIds: [] }))
      // Recharger affectations
      const { data } = await Axios.get(`${API}/api/affectations`, cfg)
      setAffectations(data)
    } catch { setMsg('❌ Erreur lors de l\'affectation.') }
    setSaving(false)
  }

  const deleteAffectation = async (id) => {
    await Axios.delete(`${API}/api/affectations/${id}`, cfg)
    setAffectations(prev => prev.filter(a => a._id !== id))
  }

  const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

  const college = niveaux.filter(n => n.categorie === 'college')
  const lycee   = niveaux.filter(n => n.categorie === 'lycee')
  const univ    = niveaux.filter(n => n.categorie === 'universite')

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Affectations</h1>
        <p className="text-gray-500 text-sm mt-1">Affecter des exercices à une séance, un groupe ou un élève</p>
      </div>

      {msg && (
        <div className={`mb-4 px-4 py-2 rounded-lg text-sm ${msg.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}
          onClick={() => setMsg(null)}>
          {msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6 mb-8">

        {/* Colonne gauche — Sélection exercices */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">1. Exercices à affecter</h2>

          {/* Niveau */}
          <div>
            <label className={labelClass}>Niveau</label>
            <div className="flex flex-wrap gap-1">
              {[...college, ...lycee, ...univ].map(n => (
                <button key={n._id} type="button" onClick={() => setNiveauId(n._id)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition
                    ${niveauId === n._id ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-500'}`}>
                  {n.nom}
                </button>
              ))}
            </div>
          </div>

          {/* Chapitre */}
          {chapitres.length > 0 && (
            <div>
              <label className={labelClass}>Chapitre</label>
              <select value={chapitreId} onChange={e => setChapitreId(e.target.value)} className={inputClass}>
                {chapitres.map(c => <option key={c._id} value={c._id}>{c.ordre}. {c.titre}</option>)}
              </select>
            </div>
          )}

          {/* Exercices */}
          {exercices.length === 0 ? (
            <p className="text-sm text-gray-400 italic">Sélectionnez un niveau et un chapitre.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {exercices.map(ex => (
                <label key={ex._id}
                  className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition
                    ${form.exerciceIds.includes(ex._id) ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="checkbox" checked={form.exerciceIds.includes(ex._id)}
                    onChange={() => toggleEx(ex._id)} className="mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{ex.enonce}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{ex.type}</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{ex.scoreMax} pts</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}

          {form.exerciceIds.length > 0 && (
            <p className="text-sm text-indigo-600 font-medium">
              {form.exerciceIds.length} exercice(s) sélectionné(s)
            </p>
          )}
        </div>

        {/* Colonne droite — Cible */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">2. Affecter à</h2>

          {/* Type de cible */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { key: 'groupe', label: '👥 Groupe',  },
              { key: 'seance', label: '📅 Séance',  },
              { key: 'eleve',  label: '👤 Élève',   },
            ].map(c => (
              <button key={c.key} type="button" onClick={() => setF('cible', c.key)}
                className={`py-2.5 rounded-xl border-2 text-sm font-medium transition
                  ${form.cible === c.key ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                {c.label}
              </button>
            ))}
          </div>

          {/* Groupe */}
          {(form.cible === 'groupe' || form.cible === 'eleve') && (
            <div>
              <label className={labelClass}>Groupe *</label>
              {groupes.length === 0 ? (
                <p className="text-xs text-gray-400">Sélectionnez un niveau d'abord.</p>
              ) : (
                <select value={form.groupeId} onChange={e => setF('groupeId', e.target.value)} className={inputClass}>
                  <option value="">-- Choisir un groupe --</option>
                  {groupes.map(g => <option key={g._id} value={g._id}>{g.nom} ({g.eleves?.length || 0} élèves)</option>)}
                </select>
              )}
            </div>
          )}

          {/* Séance */}
          {form.cible === 'seance' && (
            <div>
              <label className={labelClass}>Séance *</label>
              {seances.length === 0 ? (
                <p className="text-xs text-gray-400">Aucune séance pour ce niveau.</p>
              ) : (
                <select value={form.seanceId} onChange={e => setF('seanceId', e.target.value)} className={inputClass}>
                  <option value="">-- Choisir une séance --</option>
                  {seances.map(s => (
                    <option key={s._id} value={s._id}>
                      {s.titre} — {new Date(s.dateHeure).toLocaleDateString('fr-FR')}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Élève individuel */}
          {form.cible === 'eleve' && form.groupeId && (
            <div>
              <label className={labelClass}>Élève *</label>
              {eleves.length === 0 ? (
                <p className="text-xs text-gray-400">Ce groupe n'a pas d'élèves.</p>
              ) : (
                <select value={form.eleveId} onChange={e => setF('eleveId', e.target.value)} className={inputClass}>
                  <option value="">-- Choisir un élève --</option>
                  {eleves.map(e => <option key={e._id} value={e._id}>{e.name} ({e.email})</option>)}
                </select>
              )}
            </div>
          )}

          {/* Date échéance */}
          <div>
            <label className={labelClass}>Date d'échéance (optionnel)</label>
            <input type="datetime-local" value={form.dateEcheance}
              onChange={e => setF('dateEcheance', e.target.value)} className={inputClass} />
          </div>

          <button type="submit" disabled={saving || !form.exerciceIds.length}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition text-sm">
            {saving ? 'Affectation...' : '📤 Affecter les exercices'}
          </button>
        </div>
      </form>

      {/* Affectations existantes */}
      {affectations.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide mb-4">
            Affectations existantes ({affectations.length})
          </h2>
          <div className="flex flex-col gap-2">
            {affectations.map(a => (
              <div key={a._id} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {a.exerciceId?.enonce?.slice(0, 60)}...
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {a.cible === 'groupe' && `👥 ${a.groupeId?.nom}`}
                    {a.cible === 'seance' && `📅 ${a.seanceId?.titre}`}
                    {a.cible === 'eleve'  && `👤 ${a.eleveId?.name}`}
                    {a.dateEcheance && ` · Échéance : ${new Date(a.dateEcheance).toLocaleDateString('fr-FR')}`}
                  </p>
                </div>
                <button onClick={() => deleteAffectation(a._id)}
                  className="text-xs text-red-500 hover:text-red-700 ml-4 flex-shrink-0">
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
