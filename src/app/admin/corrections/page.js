'use client'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import Axios from 'axios'

const API = process.env.NEXT_PUBLIC_API_URL

export default function AdminCorrectionsPage() {
  const router = useRouter()
  const { userInfo } = useSelector((s) => s.userSignin || {})

  const [progressions, setProgressions] = useState([])
  const [loading,      setLoading]      = useState(true)
  const [selected,     setSelected]     = useState(null) // { progressionId, exerciceId, userId, chapitreId }
  const [score,        setScore]        = useState(10)
  const [commentaire,  setCommentaire]  = useState('')
  const [saving,       setSaving]       = useState(false)
  const [msg,          setMsg]          = useState(null)

  const cfg = { headers: { Authorization: `Bearer ${userInfo?.token}` } }

  useEffect(() => {
    if (!userInfo?.isAdmin && userInfo?.role !== 'prof') { router.push('/'); return }
    fetchCorrections()
  }, [])

  const fetchCorrections = async () => {
    setLoading(true)
    try {
      const { data } = await Axios.get(`${API}/api/progression/admin/tous`, cfg)
      // Garder seulement les progressions avec des exercices en attente de validation prof
      const filtered = data.filter(p =>
        p.exercicesRendus?.some(e => e.statut === 'en_attente' && e.validePar === 'prof')
      )
      setProgressions(filtered)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const valider = async (e) => {
    e.preventDefault()
    if (!selected) return
    setSaving(true)
    try {
      await Axios.put(`${API}/api/progression/valider-prof`, {
        userId:     selected.userId,
        chapitreId: selected.chapitreId,
        exerciceId: selected.exerciceId,
        score,
        commentaire,
      }, cfg)
      setMsg('✅ Exercice validé !')
      setSelected(null)
      setScore(10)
      setCommentaire('')
      fetchCorrections()
    } catch { setMsg('❌ Erreur lors de la validation.') }
    setSaving(false)
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Corrections</h1>
        <p className="text-gray-500 text-sm mt-1">Projets libres en attente de validation</p>
      </div>

      {msg && (
        <div className={`mb-4 px-4 py-2 rounded-lg text-sm ${msg.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {msg}
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-gray-400">Chargement...</div>
      ) : progressions.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-3xl mb-2">✅</p>
          <p>Aucun exercice en attente de correction.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {progressions.map(p =>
            p.exercicesRendus
              .filter(ex => ex.statut === 'en_attente' && ex.validePar === 'prof')
              .map(ex => (
                <div key={ex._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Élève</p>
                      <p className="font-semibold text-gray-800">{p.userId?.name}</p>
                      <p className="text-xs text-gray-400">{p.userId?.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Chapitre</p>
                      <p className="font-semibold text-gray-800">{p.chapitreId?.titre}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Soumis le</p>
                      <p className="text-sm text-gray-600">
                        {new Date(ex.soumisA).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>

                  {/* Code soumis */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Code soumis</p>
                    <pre className="bg-gray-900 text-green-400 font-mono text-xs p-4 rounded-xl overflow-auto max-h-48 whitespace-pre-wrap">
                      {ex.reponse || '(aucun code soumis)'}
                    </pre>
                  </div>

                  {/* Formulaire correction */}
                  {selected?.exerciceId === ex.exerciceId?.toString() ? (
                    <form onSubmit={valider} className="bg-indigo-50 rounded-xl p-4 space-y-3">
                      <div className="flex gap-4 items-center">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Note / {10}
                          </label>
                          <input type="number" min="0" max="10" value={score}
                            onChange={e => setScore(parseInt(e.target.value))}
                            className="w-20 border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-600 mb-1">Commentaire</label>
                          <input type="text" value={commentaire}
                            onChange={e => setCommentaire(e.target.value)}
                            placeholder="Bravo ! Pense à optimiser..."
                            className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button type="submit" disabled={saving}
                          className="bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                          {saving ? 'Validation...' : '✅ Valider'}
                        </button>
                        <button type="button" onClick={() => setSelected(null)}
                          className="bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-lg hover:bg-gray-200 transition">
                          Annuler
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      onClick={() => setSelected({
                        exerciceId: ex.exerciceId?.toString(),
                        userId:     p.userId?._id,
                        chapitreId: p.chapitreId?._id,
                      })}
                      className="bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
                    >
                      📝 Corriger
                    </button>
                  )}
                </div>
              ))
          )}
        </div>
      )}
    </div>
  )
}
