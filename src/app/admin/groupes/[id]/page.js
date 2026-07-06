'use client'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter, useParams } from 'next/navigation'
import Axios from 'axios'

const API = process.env.NEXT_PUBLIC_API_URL

export default function GroupeDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { userInfo } = useSelector((s) => s.userSignin || {})

  const [groupe,    setGroupe]    = useState(null)
  const [disponibles, setDisponibles] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [adding,    setAdding]    = useState(null)
  const [retiring,  setRetiring]  = useState(null)
  const [msg,       setMsg]       = useState(null)

  const cfg = { headers: { Authorization: `Bearer ${userInfo?.token}` } }

  useEffect(() => {
    if (!userInfo?.isAdmin && userInfo?.role !== 'prof') { router.push('/'); return }
    fetchGroupe()
  }, [id])

  const fetchGroupe = async () => {
    setLoading(true)
    try {
      const { data } = await Axios.get(`${API}/api/groupes/${id}`, cfg)
      setGroupe(data)
      // Charger les élèves disponibles du même niveau
      const { data: dispo } = await Axios.get(
        `${API}/api/groupes/eleves-disponibles?niveauId=${data.niveauId._id || data.niveauId}`,
        cfg
      )
      setDisponibles(dispo)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const ajouterEleve = async (userId) => {
    setAdding(userId)
    try {
      const { data } = await Axios.put(`${API}/api/groupes/${id}/ajouter`, { userId }, cfg)
      setGroupe(data)
      setDisponibles(prev => prev.filter(e => e._id !== userId))
      setMsg('✅ Élève ajouté au groupe')
    } catch { setMsg('❌ Erreur') }
    setAdding(null)
  }

  const retirerEleve = async (userId) => {
    setRetiring(userId)
    try {
      const { data } = await Axios.put(`${API}/api/groupes/${id}/retirer`, { userId }, cfg)
      const eleve = groupe.eleves.find(e => e._id === userId)
      setGroupe(data)
      if (eleve) setDisponibles(prev => [...prev, eleve])
      setMsg('✅ Élève retiré du groupe')
    } catch { setMsg('❌ Erreur') }
    setRetiring(null)
  }

  if (loading) return <div className="p-6 text-gray-400">Chargement...</div>
  if (!groupe)  return <div className="p-6 text-red-500">Groupe introuvable.</div>

  return (
    <div className="p-6 max-w-4xl">
      <button onClick={() => router.back()} className="text-sm text-indigo-600 hover:underline mb-4">← Retour</button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{groupe.nom}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {groupe.niveauId?.nom} · {groupe.eleves?.length || 0} élève(s)
        </p>
      </div>

      {msg && (
        <div className={`mb-4 px-4 py-2 rounded-lg text-sm ${msg.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}
          onClick={() => setMsg(null)}>
          {msg}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">

        {/* Élèves dans le groupe */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wide">
            👥 Élèves du groupe ({groupe.eleves?.length || 0})
          </h2>
          {groupe.eleves?.length === 0 ? (
            <p className="text-sm text-gray-400 italic">Aucun élève dans ce groupe.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {groupe.eleves.map(e => (
                <div key={e._id} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2.5">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{e.name}</p>
                    <p className="text-xs text-gray-400">{e.email}</p>
                  </div>
                  <button onClick={() => retirerEleve(e._id)} disabled={retiring === e._id}
                    className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition font-medium">
                    {retiring === e._id ? '...' : 'Retirer'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Élèves disponibles à ajouter */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wide">
            ➕ Élèves disponibles ({disponibles.length})
          </h2>
          {disponibles.length === 0 ? (
            <p className="text-sm text-gray-400 italic">
              Tous les élèves validés de ce niveau sont déjà dans un groupe.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {disponibles.map(e => (
                <div key={e._id} className="flex items-center justify-between bg-indigo-50 rounded-xl px-4 py-2.5">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{e.name}</p>
                    <p className="text-xs text-gray-400">{e.email}</p>
                  </div>
                  <button onClick={() => ajouterEleve(e._id)} disabled={adding === e._id}
                    className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition font-medium">
                    {adding === e._id ? '...' : '+ Ajouter'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
