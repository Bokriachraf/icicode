'use client'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Axios from 'axios'

const API = process.env.NEXT_PUBLIC_API_URL

const statutBadge = {
  planifiée: 'bg-blue-100 text-blue-700',
  en_cours:  'bg-green-100 text-green-700',
  terminée:  'bg-gray-100 text-gray-500',
  annulée:   'bg-red-100 text-red-600',
}

export default function AdminSeancesPage() {
  const router = useRouter()
  const { userInfo } = useSelector((s) => s.userSignin || {})

  const [seances, setSeances]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    if (!userInfo?.isAdmin && userInfo?.role !== 'prof') { router.push('/'); return }
    fetchSeances()
  }, [userInfo])

  const fetchSeances = async () => {
    setLoading(true)
    try {
      const { data } = await Axios.get(`${API}/api/seances`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      })
      setSeances(data)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const terminer = async (id, replayUrl) => {
    const url = prompt('URL du replay (optionnel) :', '') ?? ''
    try {
      await Axios.put(`${API}/api/seances/${id}/terminer`,
        { replayUrl: url },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      )
      fetchSeances()
    } catch (e) { console.error(e) }
  }

  const deleteSeance = async (id) => {
    if (!confirm('Supprimer cette séance ?')) return
    setDeleting(id)
    try {
      await Axios.delete(`${API}/api/seances/${id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      })
      setSeances(prev => prev.filter(s => s._id !== id))
    } catch (e) { console.error(e) }
    setDeleting(null)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Séances</h1>
          <p className="text-gray-500 text-sm mt-1">{seances.length} séances au total</p>
        </div>
        <Link href="/admin/seances/create">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition">
            + Planifier une séance
          </button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Chargement...</div>
      ) : seances.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-3xl mb-2">📅</p>
          <p>Aucune séance planifiée.</p>
          <Link href="/admin/seances/create">
            <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold">
              Planifier la première séance
            </button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {seances.map(s => (
            <div key={s._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <span className={`self-start text-xs font-semibold px-2 py-0.5 rounded-full ${statutBadge[s.statut] || statutBadge.planifiée}`}>
                  {s.statut}
                </span>
                <h3 className="font-semibold text-gray-800">{s.titre}</h3>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                  <span>📅 {new Date(s.dateHeure).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                  <span>🕐 {new Date(s.dateHeure).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                  <span>⏱ {s.duree} min</span>
                  {s.niveauId && <span>🎓 {s.niveauId.nom}</span>}
                  {s.chapitreId && <span>📐 {s.chapitreId.titre}</span>}
                  <span>👥 {s.participants?.length || 0} participant(s)</span>
                </div>
                {s.replayUrl && (
                  <a href={s.replayUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                    🎥 Voir le replay
                  </a>
                )}
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                {s.statut === 'planifiée' && (
                  <button
                    onClick={() => terminer(s._id)}
                    className="text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-100 transition font-medium"
                  >
                    ✅ Terminer
                  </button>
                )}
                <Link href={`/admin/seances/${s._id}`}>
                  <button className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition font-medium w-full">
                    Éditer
                  </button>
                </Link>
                <button
                  onClick={() => deleteSeance(s._id)}
                  disabled={deleting === s._id}
                  className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition font-medium"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
