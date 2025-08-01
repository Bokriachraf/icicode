'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useRouter } from 'next/navigation'
import { getInscriptionDetails, deleteInscription, updateInscriptionStatus } from '../../../../redux/actions/inscriptionActions'

export default function AdminInscriptionDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const dispatch = useDispatch()
  const { loading, inscription, error } = useSelector((state) => state.inscriptionDetails || {})

  const [status, setStatus] = useState('')

  useEffect(() => {
    if (id) dispatch(getInscriptionDetails(id))
  }, [dispatch, id])

  const handleDelete = () => {
    if (confirm('Confirmer la suppression ?')) {
      dispatch(deleteInscription(id)).then(() => router.push('/admin/inscription'))
    }
  }

  const handleStatusUpdate = () => {
    if (status) dispatch(updateInscriptionStatus(id, status))
  }

  return (
    <div className="pt-14 pb-24 p-8 max-w-4xl mx-auto bg-white shadow-lg rounded-md">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Détails Inscription</h1>

      {loading ? (
        <p className="text-center text-gray-600">Chargement...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="space-y-6 text-gray-800">
          <section>
            <h2 className="text-xl font-semibold mb-2 border-b pb-1">Informations Client</h2>
            <p><strong>Nom:</strong> {inscription.nom} {inscription.prenom}</p>
            <p><strong>Email:</strong> {inscription.email}</p>
            <p><strong>Téléphone:</strong> {inscription.tel}</p>
            <p><strong>Adresse:</strong> {inscription.adresseEntreprise}</p>
            <p><strong>mode</strong> {inscription.mode}</p>
            <p><strong>disponibilité</strong> {inscription.disponibilite}</p>

          </section>


          <section className="pt-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex gap-2 items-center">
                <label className="font-medium">Modifier le statut :</label>
                <select
                  className="border p-2 rounded"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">Sélectionner</option>
                  <option value="En attente">En attente</option>
                  <option value="En cours">En cours</option>
                  <option value="Validé">Validé</option>
                  <option value="Rejeté">Rejeté</option>
                </select>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                  onClick={handleStatusUpdate}
                >
                  Mettre à jour
                </button>
              </div>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={handleDelete}
              >
                Supprimer cette inscription
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

