'use client'

import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useRouter } from 'next/navigation'
import { getInscriptionDetails } from '../../../redux/actions/inscriptionActions'

const statutConfig = {
  'En attente': { bg: 'bg-blue-50',   text: 'text-blue-700',  border: 'border-blue-300',  emoji: '⏳' },
  'En cours':   { bg: 'bg-orange-50', text: 'text-orange-700',border: 'border-orange-300',emoji: '🔄' },
  'Validé':     { bg: 'bg-green-50',  text: 'text-green-700', border: 'border-green-300', emoji: '✅' },
  'Rejeté':     { bg: 'bg-red-50',    text: 'text-red-700',   border: 'border-red-300',   emoji: '❌' },
}

const Field = ({ label, value }) => (
  value ? (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</span>
      <span className="text-gray-800 font-medium">{value}</span>
    </div>
  ) : null
)

export default function InscriptionDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const router = useRouter()
  const contentRef = useRef()

  const { loading, inscription, error } = useSelector(
    (state) => state.inscriptionDetails || {}
  )

  useEffect(() => {
    if (id) dispatch(getInscriptionDetails(id))
  }, [dispatch, id])

  const statut = inscription?.status || 'En attente'
  const sc = statutConfig[statut] || statutConfig['En attente']

  const handlePrint = () => window.print()

  return (
    <div className="min-h-screen bg-gray-50 p-4 pt-24 flex justify-center">
      <div className="w-full max-w-3xl space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <button onClick={() => router.back()}
            className="text-sm text-indigo-600 hover:underline flex items-center gap-1">
            ← Retour
          </button>
          <button onClick={handlePrint}
            className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg text-gray-600 transition">
            🖨️ Imprimer
          </button>
        </div>

        {loading && (
          <div className="text-center py-16 text-gray-400">Chargement...</div>
        )}
        {error && (
          <div className="text-center py-16 text-red-500">{error}</div>
        )}

        {!loading && inscription && (
          <div ref={contentRef} className="space-y-5">

            {/* Statut — carte principale */}
            <div className={`rounded-2xl border-2 p-6 ${sc.bg} ${sc.border}`}>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Statut de la demande
                  </p>
                  <div className={`text-2xl font-bold flex items-center gap-2 ${sc.text}`}>
                    <span>{sc.emoji}</span>
                    <span>{statut}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Référence</p>
                  <p className="font-mono text-xs text-gray-600 mt-0.5">{inscription._id}</p>
                </div>
              </div>

              {/* Message selon statut */}
              <p className={`mt-3 text-sm ${sc.text} opacity-80`}>
                {statut === 'En attente' && "Votre demande a bien été reçue. Nous l'examinons dans les plus brefs délais."}
                {statut === 'En cours'   && "Votre dossier est en cours de traitement par notre équipe."}
                {statut === 'Validé'     && "Félicitations ! Votre inscription a été validée. Vous pouvez accéder à votre formation."}
                {statut === 'Rejeté'     && "Votre demande n'a pas pu être acceptée. Consultez le commentaire ci-dessous pour plus d'informations."}
              </p>
            </div>

            {/* Formation */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wide">
                📚 Formation demandée
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Formation" value={inscription.formation} />
                <Field label="Mode" value={inscription.mode} />
                <Field label="Disponibilité" value={inscription.disponibilite} />
                <Field
                  label="Niveau scolaire"
                  value={inscription.niveauId
                    ? `${inscription.niveauId.nom}${inscription.niveauId.equivalenceFrance ? ` — ${inscription.niveauId.equivalenceFrance} (FR)` : ''}`
                    : null}
                />
              </div>
            </div>

            {/* Informations personnelles */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wide">
                👤 Informations personnelles
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Prénom" value={inscription.prenom} />
                <Field label="Nom" value={inscription.nom} />
                <Field label="Email" value={inscription.email} />
                <Field label="Téléphone" value={inscription.tel} />
                <Field label="Source de découverte" value={inscription.sourceDecouverte} />
              </div>
            </div>

            {/* Dates */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wide">
                📅 Dates
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label="Date de demande"
                  value={inscription.createdAt
                    ? new Date(inscription.createdAt).toLocaleDateString('fr-FR', {
                        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                      })
                    : null}
                />
                <Field
                  label="Dernière mise à jour"
                  value={inscription.updatedAt
                    ? new Date(inscription.updatedAt).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })
                    : null}
                />
              </div>
            </div>

            {/* Commentaire admin */}
            {inscription.commentaireAdmin && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <h2 className="font-semibold text-amber-800 mb-2 text-sm uppercase tracking-wide">
                  💬 Message de l'équipe
                </h2>
                <p className="text-amber-900 text-sm leading-relaxed whitespace-pre-line">
                  {inscription.commentaireAdmin}
                </p>
              </div>
            )}

            {/* CTA si validé */}
            {statut === 'Validé' && (
              <div className="bg-green-600 rounded-2xl p-6 text-white text-center">
                <p className="font-bold text-lg mb-1">🎉 Votre accès est activé !</p>
                <p className="text-sm opacity-90 mb-4">Vous pouvez maintenant accéder à vos cours et séances.</p>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="bg-white text-green-700 font-semibold px-6 py-2 rounded-xl hover:bg-green-50 transition"
                >
                  Accéder à ma formation →
                </button>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  )
}
