'use client'
import Link from 'next/link' 
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { listMyInscription } from '../../../redux/actions/inscriptionActions'
import { Loader2, AlertCircle, CheckCircle, Clock } from 'lucide-react'

export default function SuiviInscriptionPage() {
  const dispatch = useDispatch()
  const { loading, inscription, error } = useSelector((state) => state.inscriptionListMy || {})

  useEffect(() => {
    dispatch(listMyInscription())
  }, [dispatch])
const getStatusStyle = (status) => {
  switch (status) {
    case 'Validé':
      return { color: 'text-green-600', Icon: CheckCircle }
    case 'Rejeté':
      return { color: 'text-red-600', Icon: AlertCircle }
    case 'En cours':
      return { color: 'text-orange-500', Icon: () => <Loader2 className="w-4 h-4 animate-spin" /> }
    case 'En attente':
    default:
      return { color: 'text-blue-400', Icon: Clock }
  }
}

  return (
    <div className="p-4 pt-24 pb-24 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Suivi de vos demandes d'inscription'
      </h1>

      {loading && (
        <div className="flex items-center justify-center text-gray-600">
          <Loader2 className="animate-spin mr-2" />
          Chargement en cours...
        </div>
      )}

      {error && (
        <div className="text-red-600 text-center mb-4">
          Une erreur est survenue : {error}
        </div>
      )}

      {!loading && inscription?.length === 0 && (
        <p className="text-center text-gray-500">Aucune inscription trouvé pour le moment.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {inscription?.map((item) => {
          const { color, Icon } = getStatusStyle(item.status)

          return (
            <div
              key={item._id}
              className="p-4 border rounded-lg shadow hover:shadow-md transition duration-200 bg-white"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold text-sm text-gray-600">
                  Référence : <span className="text-gray-800">{item._id}</span>
                </h2>
                <span className={`flex items-center gap-1 font-medium text-sm ${color}`}>
                  <Icon className="w-4 h-4" />
                  {item.status || 'En attente'}
                </span>
              </div>
              <p className="text-sm text-gray-700">
                <strong>Type de marchandise :</strong> {item.typeMarchandise}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Date souhaitée :</strong> {item.dateExpedition?.substring(0, 10)}
              </p>
              <Link
  href={`/inscription/${item._id}`}
  className="inline-block mt-3 text-sm text-blue-600 hover:underline font-medium"
>
  Voir les détails
</Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}


