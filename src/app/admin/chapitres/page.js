'use client'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Axios from 'axios'

const API = process.env.NEXT_PUBLIC_API_URL

export default function AdminChapitresPage() {
  const router = useRouter()
  const { userInfo } = useSelector((s) => s.userSignin || {})

  const [niveaux, setNiveaux]     = useState([])
  const [chapitres, setChapitres] = useState([])
  const [niveauId, setNiveauId]   = useState('')
  const [loading, setLoading]     = useState(false)
  const [deleting, setDeleting]   = useState(null)

  useEffect(() => {
    if (!userInfo?.isAdmin && userInfo?.role !== 'prof') { router.push('/'); return }
    fetchNiveaux()
  }, [userInfo])

  useEffect(() => {
    if (niveauId) fetchChapitres(niveauId)
    else setChapitres([])
  }, [niveauId])

  const fetchNiveaux = async () => {
    const { data } = await Axios.get(`${API}/api/niveaux`)
    setNiveaux(data)
    if (data.length > 0) setNiveauId(data[0]._id)
  }

  const fetchChapitres = async (id) => {
    setLoading(true)
    try {
      const { data } = await Axios.get(`${API}/api/chapitres?niveauId=${id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      })
      setChapitres(data)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const deleteChap = async (id) => {
    if (!confirm('Supprimer ce chapitre ?')) return
    setDeleting(id)
    try {
      await Axios.delete(`${API}/api/chapitres/${id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      })
      setChapitres(prev => prev.filter(c => c._id !== id))
    } catch (e) { console.error(e) }
    setDeleting(null)
  }

  const college = niveaux.filter(n => n.categorie === 'college')
  const lycee   = niveaux.filter(n => n.categorie === 'lycee')
  const univ    = niveaux.filter(n => n.categorie === 'universite')

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Chapitres</h1>
          <p className="text-gray-500 text-sm mt-1">Gérer le contenu par niveau</p>
        </div>
        <Link href={`/admin/chapitres/create?niveauId=${niveauId}`}>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition">
            + Nouveau chapitre
          </button>
        </Link>
      </div>

      {/* Sélecteur niveau */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
        <p className="text-xs font-medium text-gray-400 uppercase mb-3">Filtrer par niveau</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Collège', items: college, color: 'indigo' },
            { label: 'Lycée', items: lycee, color: 'amber' },
            { label: 'Université', items: univ, color: 'green' },
          ].map(({ label, items, color }) => (
            <div key={label} className="flex flex-wrap gap-1 items-center">
              <span className="text-xs text-gray-400 mr-1">{label} :</span>
              {items.map(n => (
                <button key={n._id} onClick={() => setNiveauId(n._id)}
                  className={`text-xs px-3 py-1.5 rounded-lg border-2 font-medium transition
                    ${niveauId === n._id
                      ? `border-${color}-500 bg-${color}-50 text-${color}-700`
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                >
                  {n.nom}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Liste chapitres */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">Chargement...</div>
      ) : chapitres.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-3xl mb-2">📚</p>
          <p>Aucun chapitre pour ce niveau.</p>
          <Link href={`/admin/chapitres/create?niveauId=${niveauId}`}>
            <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold">
              Créer le premier chapitre
            </button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {chapitres.map((c, i) => (
            <div key={c._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm flex items-center justify-center flex-shrink-0">
                  {c.ordre}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{c.titre}</h3>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${c.math?.contenu ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-400'}`}>
                      📐 Math {c.math?.contenu ? '✓' : '—'}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${c.python?.codeStarter ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                      🐍 Python {c.python?.codeStarter ? '✓' : '—'}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${c.math?.videoUrl ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'}`}>
                      🎥 Vidéo {c.math?.videoUrl ? '✓' : '—'}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${c.math?.fichierPdf ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-400'}`}>
                      📄 PDF {c.math?.fichierPdf ? '✓' : '—'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Link href={`/admin/chapitres/${c._id}`}>
                  <button className="text-sm bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition font-medium">
                    Éditer
                  </button>
                </Link>
                <button
                  onClick={() => deleteChap(c._id)}
                  disabled={deleting === c._id}
                  className="text-sm bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition font-medium"
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
