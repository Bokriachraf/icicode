'use client'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import Axios from 'axios'

const API = process.env.NEXT_PUBLIC_API_URL

const StatCard = ({ label, value, sub, color = 'indigo' }) => {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    green:  'bg-green-50  text-green-700  border-green-100',
    amber:  'bg-amber-50  text-amber-700  border-amber-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100',
  }
  return (
    <div className={`rounded-2xl border p-5 ${colors[color]}`}>
      <p className="text-xs font-medium uppercase tracking-wide opacity-70 mb-1">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
      {sub && <p className="text-xs opacity-60 mt-1">{sub}</p>}
    </div>
  )
}

export default function AdminStatsPage() {
  const router = useRouter()
  const { userInfo } = useSelector((s) => s.userSignin || {})

  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)

  const cfg = { headers: { Authorization: `Bearer ${userInfo?.token}` } }

  useEffect(() => {
    if (!userInfo?.isAdmin) { router.push('/'); return }
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setLoading(true)
    try {
      const [usersRes, inscriptionsRes, paiementsRes, abonnementsRes, chapitresRes, seancesRes] =
        await Promise.all([
          Axios.get(`${API}/api/admin/users`, cfg),
          Axios.get(`${API}/api/inscription/admin`, cfg),
          Axios.get(`${API}/api/paiements/admin`, cfg),
          Axios.get(`${API}/api/abonnements/admin`, cfg),
          Axios.get(`${API}/api/chapitres`, cfg),
          Axios.get(`${API}/api/seances`, cfg),
        ])

      const users         = usersRes.data
      const inscriptions  = inscriptionsRes.data
      const paiements     = paiementsRes.data
      const abonnements   = abonnementsRes.data
      const chapitres     = chapitresRes.data
      const seances       = seancesRes.data

      const totalEncaisse = paiements
        .filter(p => p.statut === 'payé')
        .reduce((s, p) => s + p.montant, 0)

      const revenuMoisCourant = paiements
        .filter(p => {
          if (p.statut !== 'payé') return false
          const d = new Date(p.createdAt)
          const now = new Date()
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
        })
        .reduce((s, p) => s + p.montant, 0)

      setStats({
        totalEleves:       users.filter(u => !u.isAdmin && u.role !== 'prof').length,
        totalProfs:        users.filter(u => u.role === 'prof').length,
        inscriptionsEnAttente: inscriptions.filter(i => i.status === 'En attente').length,
        inscriptionsValidees:  inscriptions.filter(i => i.status === 'Validé').length,
        abonnementsActifs: abonnements.filter(a => a.statut === 'actif').length,
        paiementsEnAttente: paiements.filter(p => p.statut === 'en_attente').length,
        totalEncaisse,
        revenuMoisCourant,
        totalChapitres: chapitres.length,
        seancesPlanifiees: seances.filter(s => s.statut === 'planifiée').length,
        seancesTerminees:  seances.filter(s => s.statut === 'terminée').length,
        derniersPaiements: paiements.slice(0, 5),
        dernieresInscriptions: inscriptions.slice(0, 5),
      })
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  if (loading) return <div className="p-6 text-gray-400 text-center pt-20">Chargement des statistiques...</div>
  if (!stats)  return <div className="p-6 text-red-500">Erreur de chargement.</div>

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Statistiques</h1>
        <p className="text-gray-500 text-sm mt-1">Vue d'ensemble de la plateforme</p>
      </div>

      {/* Revenus */}
      <div>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Revenus</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total encaissé" value={`${stats.totalEncaisse} TND`} color="green" />
          <StatCard label="Ce mois-ci" value={`${stats.revenuMoisCourant} TND`} color="green" />
          <StatCard label="Abonnements actifs" value={stats.abonnementsActifs} color="indigo" />
          <StatCard label="Paiements en attente" value={stats.paiementsEnAttente} sub="à confirmer" color="amber" />
        </div>
      </div>

      {/* Élèves */}
      <div>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Utilisateurs</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Élèves inscrits" value={stats.totalEleves} color="indigo" />
          <StatCard label="Professeurs" value={stats.totalProfs} color="purple" />
          <StatCard label="Inscriptions validées" value={stats.inscriptionsValidees} color="green" />
          <StatCard label="Inscriptions en attente" value={stats.inscriptionsEnAttente} sub="à traiter" color="amber" />
        </div>
      </div>

      {/* Contenu */}
      <div>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Contenu</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard label="Chapitres" value={stats.totalChapitres} color="purple" />
          <StatCard label="Séances planifiées" value={stats.seancesPlanifiees} color="indigo" />
          <StatCard label="Séances terminées" value={stats.seancesTerminees} color="green" />
        </div>
      </div>

      {/* Dernières activités */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Derniers paiements */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide mb-4">
            Derniers paiements
          </h2>
          {stats.derniersPaiements.length === 0 ? (
            <p className="text-sm text-gray-400 italic">Aucun paiement.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {stats.derniersPaiements.map(p => (
                <div key={p._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{p.eleveId?.name}</p>
                    <p className="text-xs text-gray-400">{new Date(p.createdAt).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-800">{p.montant} TND</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${p.statut === 'payé' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {p.statut}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dernières inscriptions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide mb-4">
            Dernières inscriptions
          </h2>
          {stats.dernieresInscriptions.length === 0 ? (
            <p className="text-sm text-gray-400 italic">Aucune inscription.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {stats.dernieresInscriptions.map(i => (
                <div key={i._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{i.prenom} {i.nom}</p>
                    <p className="text-xs text-gray-400">{i.formation}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    i.status === 'Validé'     ? 'bg-green-100 text-green-700' :
                    i.status === 'En attente' ? 'bg-blue-100 text-blue-700'  :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {i.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
