'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useRouter } from 'next/navigation'
import { getInscriptionDetails, deleteInscription, updateInscriptionStatus } from '../../../../redux/actions/inscriptionActions'

const STATUT_STYLE = {
  'En attente': 'bg-amber-100 text-amber-700',
  'En cours':   'bg-blue-100 text-blue-700',
  'Validé':     'bg-green-100 text-green-700',
  'Rejeté':     'bg-red-100 text-red-700',
}

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</span>
    <span className="text-sm text-gray-800">{value || <span className="text-gray-300">—</span>}</span>
  </div>
)

export default function AdminInscriptionDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const dispatch = useDispatch()
  const { loading, inscription, error } = useSelector((state) => state.inscriptionDetails || {})

  const [status, setStatus] = useState('')
  const [commentaireAdmin, setCommentaireAdmin] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (id) dispatch(getInscriptionDetails(id))
  }, [dispatch, id])

  useEffect(() => {
    if (inscription) {
      setStatus(inscription.status || '')
      setCommentaireAdmin(inscription.commentaireAdmin || '')
    }
  }, [inscription])

  const handleDelete = () => {
    if (confirm('Confirmer la suppression définitive de cette inscription ?')) {
      dispatch(deleteInscription(id)).then(() => router.push('/admin/inscription'))
    }
  }

  const handleStatusUpdate = async () => {
    setSaving(true)
    setSaved(false)
    await dispatch(updateInscriptionStatus(id, status, commentaireAdmin))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button onClick={() => router.push('/admin/inscription')} className="text-sm text-indigo-600 hover:underline mb-4">
        ← Retour aux inscriptions
      </button>

      {loading ? (
        <p className="text-center text-gray-400 py-16">Chargement...</p>
      ) : error ? (
        <p className="text-center text-red-500 py-16">{error}</p>
      ) : !inscription ? (
        <p className="text-center text-gray-400 py-16">Inscription introuvable.</p>
      ) : (
        <div className="space-y-6">

          {/* En-tête */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                {inscription.prenom} {inscription.nom}
              </h1>
              <p className="text-xs text-gray-400 mt-1 font-mono">Réf. {inscription._id}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUT_STYLE[inscription.status] || 'bg-gray-100 text-gray-600'}`}>
                {inscription.status}
              </span>
              {!inscription.vu && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
                  Nouvelle
                </span>
              )}
            </div>
          </div>

          {/* Formation demandée */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">📚 Formation demandée</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <InfoRow label="Formation" value={inscription.formation} />
              <InfoRow label="Mode" value={inscription.mode} />
              <InfoRow label="Disponibilité" value={inscription.disponibilite} />
              <InfoRow
                label="Niveau scolaire"
                value={inscription.niveauId ? `${inscription.niveauId.nom}${inscription.niveauId.systeme ? ` (${inscription.niveauId.systeme})` : ''}` : null}
              />
              <InfoRow label="Catégorie" value={inscription.niveauId?.categorie} />
              <InfoRow label="Équivalence France" value={inscription.niveauId?.equivalenceFrance} />
            </div>
          </div>

          {/* Informations personnelles */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">👤 Informations personnelles</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <InfoRow label="Prénom" value={inscription.prenom} />
              <InfoRow label="Nom" value={inscription.nom} />
              <InfoRow label="Email" value={inscription.email} />
              <InfoRow label="Téléphone" value={inscription.tel} />
              <InfoRow label="Adresse" value={inscription.adresse} />
              <InfoRow label="Source de découverte" value={inscription.sourceDecouverte} />
              <InfoRow label="Newsletter" value={inscription.newsletterConsent ? 'Oui ✅' : 'Non'} />
            </div>
            {inscription.commentaireEleve && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <InfoRow label="Commentaire de l'élève" value={inscription.commentaireEleve} />
              </div>
            )}
          </div>

          {/* Compte lié */}
          {inscription.user && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">🔗 Compte utilisateur lié</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <InfoRow label="Nom du compte" value={inscription.user.name} />
                <InfoRow label="Email du compte" value={inscription.user.email} />
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">📅 Dates</h2>
            <div className="grid grid-cols-2 gap-4">
              <InfoRow
                label="Date de la demande"
                value={inscription.createdAt && new Date(inscription.createdAt).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              />
              <InfoRow
                label="Dernière mise à jour"
                value={inscription.updatedAt && new Date(inscription.updatedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              />
            </div>
          </div>

          {/* Traitement admin */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">⚙️ Traitement</h2>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Statut</label>
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="En attente">En attente</option>
                <option value="En cours">En cours</option>
                <option value="Validé">Validé</option>
                <option value="Rejeté">Rejeté</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Commentaire admin (interne)</label>
              <textarea
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
                rows={3}
                value={commentaireAdmin}
                onChange={(e) => setCommentaireAdmin(e.target.value)}
                placeholder="Note interne, non visible par l'élève..."
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition disabled:opacity-60"
                onClick={handleStatusUpdate}
                disabled={saving}
              >
                {saving ? 'Enregistrement...' : 'Mettre à jour'}
              </button>
              {saved && <span className="text-sm text-green-600">✅ Enregistré</span>}

              <button
                className="ml-auto bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-5 py-2.5 rounded-xl text-sm transition"
                onClick={handleDelete}
              >
                🗑 Supprimer cette inscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
