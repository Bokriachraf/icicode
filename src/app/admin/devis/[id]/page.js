'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useRouter } from 'next/navigation'
import { getDevisDetails, deleteDevis, updateDevisStatus } from '../../../../redux/actions/devisActions'

export default function AdminDevisDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const dispatch = useDispatch()
  const { loading, devis, error } = useSelector((state) => state.devisDetails || {})

  const [status, setStatus] = useState('')

  useEffect(() => {
    if (id) dispatch(getDevisDetails(id))
  }, [dispatch, id])

  const handleDelete = () => {
    if (confirm('Confirmer la suppression ?')) {
      dispatch(deleteDevis(id)).then(() => router.push('/admin/devis'))
    }
  }

  const handleStatusUpdate = () => {
    if (status) dispatch(updateDevisStatus(id, status))
  }

  return (
    <div className="pt-14 pb-24 p-8 max-w-4xl mx-auto bg-white shadow-lg rounded-md">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Détails du devis</h1>

      {loading ? (
        <p className="text-center text-gray-600">Chargement...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="space-y-6 text-gray-800">
          <section>
            <h2 className="text-xl font-semibold mb-2 border-b pb-1">Informations Client</h2>
            <p><strong>Nom:</strong> {devis.nom} {devis.prenom}</p>
            <p><strong>Email:</strong> {devis.email}</p>
            <p><strong>Téléphone:</strong> {devis.telephone}</p>
            <p><strong>Nom Entreprise:</strong> {devis.nomEntreprise}</p>
            <p><strong>Adresse:</strong> {devis.adresseEntreprise}</p>
            <p><strong>Code Entreprise:</strong> {devis.CodeEntreprise}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2 border-b pb-1">Marchandise</h2>
            <p><strong>Type:</strong> {devis.typeMarchandise}</p>
            <p><strong>HS Code:</strong> {devis.hsCode}</p>
            <p><strong>Poids Net:</strong> {devis.poidsNet} kg</p>
            <p><strong>Poids Total:</strong> {devis.poidsTotal} kg</p>
            <p><strong>Volume:</strong> {devis.volume} m³</p>
            <p><strong>Emballage Actuel:</strong> {devis.emballageActuel}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2 border-b pb-1">Transport & Services</h2>
            <p><strong>Modes de transport:</strong> {devis.modeTransport?.join(', ')}</p>
            <p><strong>Services souhaités:</strong> {devis.servicesSouhaites?.join(', ')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2 border-b pb-1">Informations Logistiques</h2>
            <p><strong>Marchandise:</strong> {devis.marchandise}</p>
            <p><strong>Poids:</strong> {devis.poids}</p>
            <p><strong>Date souhaitée:</strong> {devis.dateSouhaitee}</p>
            <p><strong>Pays Départ:</strong> {devis.paysDepart}</p>
            <p><strong>Adresse Départ:</strong> {devis.adresseDepart}</p>
            <p><strong>Pays Arrivée:</strong> {devis.paysArrivee}</p>
            <p><strong>Adresse Arrivée:</strong> {devis.adresseArrivee}</p>
            <p><strong>Incoterm:</strong> {devis.incoterm}</p>
            <p><strong>Date Expédition:</strong> {devis.dateExpedition?.substring(0, 10)}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2 border-b pb-1">Divers</h2>
            <p><strong>Détails supplémentaires:</strong> {devis.detailsSupplementaires}</p>
            <p><strong>Secteur d'activité:</strong> {devis.secteurActivite}</p>
            <p><strong>Découvert via:</strong> {devis.sourceDecouverte}</p>
            <p><strong>Consentement newsletter:</strong> {devis.newsletterConsent ? 'Oui' : 'Non'}</p>
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
                Supprimer ce devis
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}


// 'use client'

// import { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { useParams, useRouter } from 'next/navigation'
// import { getDevisDetails, deleteDevis, updateDevisStatus } from '../../../../redux/actions/devisActions'

// export default function AdminDevisDetailPage() {
//   const { id } = useParams()
//   const router = useRouter()
//   const dispatch = useDispatch()
//   const { loading, devis, error } = useSelector((state) => state.devisDetails)

//   const [status, setStatus] = useState('')

//   useEffect(() => {
//     if (id) dispatch(getDevisDetails(id))
//   }, [dispatch, id])

//   const handleDelete = () => {
//     if (confirm('Confirmer la suppression ?')) {
//       dispatch(deleteDevis(id)).then(() => router.push('/admin/devis'))
//     }
//   }

//   const handleStatusUpdate = () => {
//     if (status) dispatch(updateDevisStatus(id, status))
//   }

//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-bold mb-4">Détails du devis</h1>

//       {loading ? (
//         <p>Chargement...</p>
//       ) : error ? (
//         <p className="text-red-500">{error}</p>
//       ) : (
//         <div className="space-y-3">
//           <p><strong>Client:</strong> {devis.nom} {devis.prenom}</p>
//           <p><strong>Email:</strong> {devis.email}</p>
//           <p><strong>Statut:</strong> {devis.status}</p>
//           <select
//             className="border p-2 rounded"
//             value={status}
//             onChange={(e) => setStatus(e.target.value)}
//           >
//             <option value="">Modifier le statut</option>
//             <option value="En attente">En attente</option>
//             <option value="En cours">En cours</option>
//             <option value="Validé">Validé</option>
//             <option value="Rejeté">Rejeté</option>
//           </select>
//           <button
//             className="ml-2 bg-blue-600 text-white px-4 py-2 rounded"
//             onClick={handleStatusUpdate}
//           >
//             Mettre à jour
//           </button>

//           <button
//             className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
//             onClick={handleDelete}
//           >
//             Supprimer ce devis
//           </button>
//         </div>
//       )}
//     </div>
//   )
// }


// 'use client'

// import { useEffect } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { useParams } from 'next/navigation'
// import { getDevisDetails } from '../../../redux/actions/devisActions'
// import { Loader2 } from 'lucide-react'
// import Link from 'next/link'

// export default function AdminDevisDetailPage() {
//   const { id } = useParams()
//   const dispatch = useDispatch()
//   const { loading, devis, error } = useSelector((state) => state.devisDetails)

//   useEffect(() => {
//     if (id) {
//       dispatch(getDevisDetails(id))
//     }
//   }, [dispatch, id])

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold text-gray-800">Détail du devis (Admin)</h1>
//           <Link
//             href="/admin/devis"
//             className="text-sm text-blue-600 hover:underline"
//           >
//             ⬅ Retour à la liste
//           </Link>
//         </div>

//         {loading ? (
//           <div className="text-gray-600 flex justify-center items-center gap-2">
//             <Loader2 className="animate-spin w-5 h-5" /> Chargement...
//           </div>
//         ) : error ? (
//           <p className="text-red-600 font-semibold text-center">{error}</p>
//         ) : devis ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800">
//             <div className="col-span-full">
//               <h2 className="text-lg font-semibold mb-2">Informations client</h2>
//               <p><span className="font-medium">Nom :</span> {devis.nom} {devis.prenom}</p>
//               <p><span className="font-medium">Email :</span> {devis.email}</p>
//               <p><span className="font-medium">Téléphone :</span> {devis.telephone}</p>
//               <p><span className="font-medium">Entreprise :</span> {devis.nomEntreprise}</p>
//               <p><span className="font-medium">Adresse :</span> {devis.adresseEntreprise}</p>
//             </div>

//             <div>
//               <h2 className="text-lg font-semibold mb-2">Marchandise</h2>
//               <p><span className="font-medium">Type :</span> {devis.typeMarchandise}</p>
//               <p><span className="font-medium">HS Code :</span> {devis.hsCode}</p>
//               <p><span className="font-medium">Poids net :</span> {devis.poidsNet} kg</p>
//               <p><span className="font-medium">Poids brut :</span> {devis.poidsTotal} kg</p>
//               <p><span className="font-medium">Volume :</span> {devis.volume} m³</p>
//               <p><span className="font-medium">Emballage :</span> {devis.emballageActuel}</p>
//             </div>

//             <div>
//               <h2 className="text-lg font-semibold mb-2">Transport & Services</h2>
//               <p><span className="font-medium">Mode :</span> {devis.modeTransport?.join(', ')}</p>
//               <p><span className="font-medium">Services :</span> {devis.servicesSouhaites?.join(', ')}</p>
//               <p><span className="font-medium">Date souhaitée :</span> {devis.dateSouhaitee?.substring(0, 10)}</p>
//               <p><span className="font-medium">Statut :</span> {devis.status}</p>
//             </div>

//             {devis.detailsSupplementaires && (
//               <div className="col-span-full mt-4 bg-gray-100 p-4 rounded-md border">
//                 <h3 className="font-semibold mb-2">Détails supplémentaires :</h3>
//                 <p className="whitespace-pre-line text-sm text-gray-700">{devis.detailsSupplementaires}</p>
//               </div>
//             )}
//           </div>
//         ) : null}
//       </div>
//     </div>
//   )
// }
