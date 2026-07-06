'use client'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Axios from 'axios'

const API = process.env.NEXT_PUBLIC_API_URL

export default function AdminGroupesPage() {
  const router = useRouter()
  const { userInfo } = useSelector((s) => s.userSignin || {})

  const [niveaux,  setNiveaux]  = useState([])
  const [groupes,  setGroupes]  = useState([])
  const [niveauId, setNiveauId] = useState('')
  const [loading,  setLoading]  = useState(false)

  // Création groupe
  const [showForm, setShowForm] = useState(false)
  const [nomGroupe, setNomGroupe] = useState('')
  const [creating, setCreating]  = useState(false)
  const [msg, setMsg] = useState(null)

  const cfg = { headers: { Authorization: `Bearer ${userInfo?.token}` } }

  useEffect(() => {
    if (!userInfo?.isAdmin && userInfo?.role !== 'prof') { router.push('/'); return }
    Axios.get(`${API}/api/niveaux`).then(r => {
      setNiveaux(r.data)
      if (r.data.length > 0) setNiveauId(r.data[0]._id)
    })
  }, [])

  useEffect(() => {
    if (!niveauId) return
    setLoading(true)
    Axios.get(`${API}/api/groupes?niveauId=${niveauId}`, cfg)
      .then(r => setGroupes(r.data))
      .finally(() => setLoading(false))
  }, [niveauId])

  const createGroupe = async (e) => {
    e.preventDefault()
    if (!nomGroupe.trim()) return
    setCreating(true)
    try {
      const { data } = await Axios.post(`${API}/api/groupes`, { nom: nomGroupe, niveauId }, cfg)
      setGroupes(prev => [data, ...prev])
      setNomGroupe('')
      setShowForm(false)
      setMsg('✅ Groupe créé')
    } catch { setMsg('❌ Erreur') }
    setCreating(false)
  }

  const deleteGroupe = async (id) => {
    if (!confirm('Supprimer ce groupe ?')) return
    await Axios.delete(`${API}/api/groupes/${id}`, cfg)
    setGroupes(prev => prev.filter(g => g._id !== id))
  }

  const retirerEleve = async (groupeId, userId) => {
    const { data } = await Axios.put(`${API}/api/groupes/${groupeId}/retirer`, { userId }, cfg)
    setGroupes(prev => prev.map(g => g._id === groupeId ? data : g))
  }

  const college = niveaux.filter(n => n.categorie === 'college')
  const lycee   = niveaux.filter(n => n.categorie === 'lycee')
  const univ    = niveaux.filter(n => n.categorie === 'universite')

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Groupes</h1>
          <p className="text-gray-500 text-sm mt-1">Gérer les groupes d'élèves par niveau</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition">
          + Nouveau groupe
        </button>
      </div>

      {msg && (
        <div className={`mb-4 px-4 py-2 rounded-lg text-sm ${msg.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {msg}
        </div>
      )}

      {/* Formulaire création */}
      {showForm && (
        <form onSubmit={createGroupe} className="bg-white rounded-2xl border border-indigo-100 shadow-sm p-5 mb-6 flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du groupe</label>
            <input value={nomGroupe} onChange={e => setNomGroupe(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Ex: Groupe A — BAC 2025" required />
          </div>
          <button type="submit" disabled={creating}
            className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition">
            {creating ? 'Création...' : 'Créer'}
          </button>
          <button type="button" onClick={() => setShowForm(false)}
            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl text-sm hover:bg-gray-200 transition">
            Annuler
          </button>
        </form>
      )}

      {/* Filtre niveau */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
        <p className="text-xs font-medium text-gray-400 uppercase mb-3">Niveau</p>
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

      {/* Liste groupes */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">Chargement...</div>
      ) : groupes.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-3xl mb-2">👥</p>
          <p>Aucun groupe pour ce niveau.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {groupes.map(g => (
            <div key={g._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800">{g.nom}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{g.eleves?.length || 0} élève(s)</p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/groupes/${g._id}`}>
                    <button className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition font-medium">
                      Gérer
                    </button>
                  </Link>
                  <button onClick={() => deleteGroupe(g._id)}
                    className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition font-medium">
                    Supprimer
                  </button>
                </div>
              </div>

              {/* Liste élèves */}
              {g.eleves?.length > 0 ? (
                <div className="flex flex-col gap-1.5">
                  {g.eleves.map(e => (
                    <div key={e._id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                      <div>
                        <p className="text-sm font-medium text-gray-700">{e.name}</p>
                        <p className="text-xs text-gray-400">{e.email}</p>
                      </div>
                      <button onClick={() => retirerEleve(g._id, e._id)}
                        className="text-xs text-red-500 hover:text-red-700 transition">
                        Retirer
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">Aucun élève dans ce groupe.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
