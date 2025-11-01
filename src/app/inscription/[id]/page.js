'use client'

import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useRouter } from 'next/navigation'
import { getInscriptionDetails } from '../../../redux/actions/inscriptionActions'
import html2pdf from 'html2pdf.js'

export default function InscriptionDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const router = useRouter()
  const contentRef = useRef()

  const { loading, inscription, error } = useSelector(
    (state) => state.inscriptionDetails || {}
  )

  useEffect(() => {
    if (id) {
      dispatch(getInscriptionDetails(id))
    }
  }, [dispatch, id])

  const handleRetour = () => {
    router.back()
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = () => {
    const element = contentRef.current
    html2pdf()
      .set({
        margin: 0.5,
        filename: `inscription-${inscription._id}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { format: 'a4' },
      })
      .from(element)
      .save()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-24 flex justify-center">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-8" ref={contentRef}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Détail de la demande d’inscription
          </h1>
          <div className="space-x-2">
            <button
              onClick={handleRetour}
              className="bg-gray-200 hover:bg-gray-300 text-sm px-3 py-1.5 rounded-md"
            >
              🔙 Retour
            </button>
            <button
              onClick={handlePrint}
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1.5 rounded-md"
            >
              🖨️ Imprimer
            </button>
            <button
              onClick={handleDownloadPDF}
              className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1.5 rounded-md"
            >
              📄 Télécharger PDF
            </button>
          </div>
        </div>

        {loading && <p className="text-center text-gray-600 italic">Chargement en cours...</p>}

        {error && <p className="text-center text-red-600 font-semibold">{error}</p>}

        {!loading && inscription && (
          <div className="space-y-4 text-gray-800 text-base leading-relaxed">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              <p><span className="font-semibold text-gray-700">ID :</span> {inscription._id}</p>
              <p><span className="font-semibold text-gray-700">Nom :</span> {inscription.nom}</p>
              <p><span className="font-semibold text-gray-700">Prénom :</span> {inscription.prenom}</p>
              <p><span className="font-semibold text-gray-700">Email :</span> {inscription.email}</p>
              <p><span className="font-semibold text-gray-700">Téléphone :</span> {inscription.tel}</p>
              <p><span className="font-semibold text-gray-700">Formation choisie :</span> {inscription.formation}</p>
              <p><span className="font-semibold text-gray-700">Disponibilité :</span> {inscription.disponibilite}</p>
              <p><span className="font-semibold text-gray-700">Mode :</span> {inscription.mode}</p>
            </div>

            {inscription.commentaire && (
              <div className="mt-6 p-4 bg-gray-100 rounded-md border border-gray-200">
                <h2 className="font-semibold mb-2 text-gray-800">Commentaire :</h2>
                <p className="whitespace-pre-line">{inscription.commentaire}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
