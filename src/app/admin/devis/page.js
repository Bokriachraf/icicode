'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { listAllDevis, marquerTousDevisCommeVus } from '../../../redux/actions/devisActions'
import { Loader2, CheckCircle, Clock, AlertCircle, Eye } from 'lucide-react'
import Link from 'next/link'


export default function AdminDevisPage() {
  const dispatch = useDispatch()
  const { loading, devis, error } = useSelector((state) => state.devisAdminList || {})
useEffect(() => {
  
  dispatch(marquerTousDevisCommeVus())
}, [dispatch])
 

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Validé':
        return { color: 'text-green-600', Icon: CheckCircle }
      case 'Rejeté':
        return { color: 'text-red-600', Icon: AlertCircle }
      case 'En cours':
        return { color: 'text-orange-500', Icon: Clock }
      default:
        return { color: 'text-yellow-500', Icon: Clock }
    }
  }

  return (
    <div className="pt-14 pb-24 min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Gestion des Devis Clients
      </h1>

      {loading ? (
        <div className="flex items-center justify-center text-gray-600">
          <Loader2 className="animate-spin mr-2" /> Chargement...
        </div>
      ) : error ? (
        <div className="text-red-600 text-center font-semibold">{error}</div>
      ) : devis?.length === 0 ? (
        <p className="text-center text-gray-500">Aucun devis trouvé.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-left text-sm text-gray-700">
                <th className="p-3">Client</th>
                <th className="p-3">Marchandise</th>
                <th className="p-3">Date</th>
                <th className="p-3">Statut</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {devis.map((d) => {
                const { Icon, color } = getStatusIcon(d.status)
                return (
                  <tr key={d._id} className="border-t hover:bg-gray-50">
                    <td className="p-3 text-sm">{d.user?.name} <br /><span className="text-xs text-gray-500">{d.user?.email}</span></td>
                    <td className="p-3 text-sm">{d.typeMarchandise}</td>
                    <td className="p-3 text-sm">{d.dateExpedition?.substring(0, 10)}</td>
                    <td className="p-3 text-sm">
                      <span className={`inline-flex items-center gap-1 ${color} font-medium`}>
                        <Icon className="w-4 h-4" /> {d.status || 'En attente'}
                      </span>
                    </td>
                    <td className="p-3 text-sm">
                      <Link
                        href={`/admin/devis/${d._id}`}
                        className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" /> Détails
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}