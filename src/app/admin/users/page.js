'use client'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import Axios from 'axios'

const API = process.env.NEXT_PUBLIC_API_URL

const roleBadge = {
  admin: 'bg-red-100 text-red-700',
  prof:  'bg-purple-100 text-purple-700',
  etudiant: 'bg-blue-100 text-blue-700',
}

export default function AdminUsersPage() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { userInfo } = useSelector((s) => s.userSignin || {})

  const [users, setUsers]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    if (!userInfo?.isAdmin) { router.push('/'); return }
    fetchUsers()
  }, [userInfo])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const { data } = await Axios.get(`${API}/api/admin/users`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      })
      setUsers(data)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const changeRole = async (id, role, isAdmin) => {
    setUpdating(id)
    try {
      await Axios.put(`${API}/api/admin/users/${id}/role`,
        { role, isAdmin },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      )
      setUsers(prev => prev.map(u => u._id === id ? { ...u, role, isAdmin } : u))
    } catch (e) { console.error(e) }
    setUpdating(null)
  }

  const deleteUser = async (id) => {
    if (!confirm('Supprimer cet utilisateur ?')) return
    try {
      await Axios.delete(`${API}/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      })
      setUsers(prev => prev.filter(u => u._id !== id))
    } catch (e) { console.error(e) }
  }

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Utilisateurs</h1>
          <p className="text-gray-500 text-sm mt-1">{users.length} utilisateurs au total</p>
        </div>
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-800 w-64 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Chargement...</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Nom</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Email</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Niveau</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Rôle</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(u => (
                <tr key={u._id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-3 text-gray-800 font-medium">{u.name}</td>
                  <td className="px-5 py-3 text-gray-500">{u.email}</td>
                  <td className="px-5 py-3 text-gray-500">{u.niveauId?.nom || '—'}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${roleBadge[u.role] || roleBadge.etudiant}`}>
                      {u.isAdmin ? '👑 Admin' : u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Promouvoir prof */}
                      {!u.isAdmin && u.role !== 'prof' && (
                        <button
                          onClick={() => changeRole(u._id, 'prof', false)}
                          disabled={updating === u._id}
                          className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-lg hover:bg-purple-200 transition"
                        >
                          → Prof
                        </button>
                      )}
                      {/* Rétrograder en étudiant */}
                      {!u.isAdmin && u.role === 'prof' && (
                        <button
                          onClick={() => changeRole(u._id, 'etudiant', false)}
                          disabled={updating === u._id}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-200 transition"
                        >
                          → Étudiant
                        </button>
                      )}
                      {/* Supprimer */}
                      {u._id !== userInfo._id && (
                        <button
                          onClick={() => deleteUser(u._id)}
                          className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-lg hover:bg-red-100 transition"
                        >
                          Supprimer
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
