'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useRouter } from 'next/navigation'
import { getInscriptionDetails } from '../../../redux/actions/inscriptionActions'

const statutConfig = {
  'En attente': {
    border: 'rgba(74,144,226,0.35)',
    bg:     'rgba(74,144,226,0.08)',
    color:  '#4A90E2',
    emoji:  '⏳',
    msg:    "Votre demande a bien été reçue. Nous l'examinons dans les plus brefs délais.",
  },
  'En cours': {
    border: 'rgba(255,165,0,0.35)',
    bg:     'rgba(255,165,0,0.08)',
    color:  '#FFA500',
    emoji:  '🔄',
    msg:    'Votre dossier est en cours de traitement par notre équipe.',
  },
  'Validé': {
    border: 'rgba(0,255,209,0.35)',
    bg:     'rgba(0,255,209,0.08)',
    color:  '#00FFD1',
    emoji:  '✅',
    msg:    "Félicitations ! Votre inscription a été validée. Vous pouvez accéder à votre formation.",
  },
  'Rejeté': {
    border: 'rgba(255,80,80,0.35)',
    bg:     'rgba(255,80,80,0.08)',
    color:  '#FF6B6B',
    emoji:  '❌',
    msg:    "Votre demande n'a pas pu être acceptée. Consultez le commentaire ci-dessous.",
  },
}

/* ── Carte de section ── */
const Section = ({ icon, title, children }) => (
  <div className="brand-card p-6">
    <h2 className="text-xs font-semibold uppercase tracking-widest mb-5 flex items-center gap-2"
      style={{ color: 'var(--text-muted)' }}>
      <span>{icon}</span> {title}
    </h2>
    {children}
  </div>
)

/* ── Champ label + valeur ── */
const Field = ({ label, value }) => {
  if (!value) return null
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[0.65rem] uppercase tracking-widest font-medium"
        style={{ color: 'var(--text-muted)' }}>
        {label}
      </span>
      <span className="text-sm font-medium" style={{ color: 'var(--brand-white)' }}>
        {value}
      </span>
    </div>
  )
}

export default function InscriptionDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const router = useRouter()

  const { loading, inscription, error } = useSelector(
    (s) => s.inscriptionDetails || {}
  )

  useEffect(() => {
    if (id) dispatch(getInscriptionDetails(id))
  }, [dispatch, id])

  const statut = inscription?.status || 'En attente'
  const sc = statutConfig[statut] || statutConfig['En attente']

  return (
    <div className="min-h-screen px-4 pt-24 pb-24 flex justify-center">
      <div className="w-full max-w-2xl space-y-5">

        {/* Header navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-sm flex items-center gap-1 hover:underline"
            style={{ color: 'var(--brand-cyan)' }}
          >
            ← Retour
          </button>
          <button
            onClick={() => window.print()}
            className="text-sm px-3 py-1.5 rounded-lg transition"
            style={{
              background:  'rgba(255,255,255,0.05)',
              border:      '1px solid rgba(255,255,255,0.12)',
              color:       'var(--text-secondary)',
            }}
          >
            🖨️ Imprimer
          </button>
        </div>

        {/* Loader */}
        {loading && (
          <div className="text-center py-16 text-sm" style={{ color: 'var(--text-muted)' }}>
            Chargement...
          </div>
        )}

        {/* Erreur */}
        {error && (
          <div className="brand-card p-5 text-center text-sm"
            style={{ color: '#FF6B6B', borderColor: 'rgba(255,80,80,0.3)' }}>
            {error}
          </div>
        )}

        {!loading && inscription && (
          <>
            {/* ── Carte statut principale ── */}
            <div style={{
              background:   sc.bg,
              border:       `1px solid ${sc.border}`,
              borderRadius: '14px',
              padding:      '24px',
            }}>
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <p className="text-[0.65rem] uppercase tracking-widest mb-2"
                    style={{ color: 'var(--text-muted)' }}>
                    Statut de la demande
                  </p>
                  <div className="flex items-center gap-2 text-2xl font-bold"
                    style={{ color: sc.color }}>
                    <span>{sc.emoji}</span>
                    <span>{statut}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[0.65rem] uppercase tracking-widest mb-1"
                    style={{ color: 'var(--text-muted)' }}>
                    Référence
                  </p>
                  <p className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {inscription._id}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm" style={{ color: sc.color, opacity: 0.85 }}>
                {sc.msg}
              </p>
            </div>

            {/* ── Formation ── */}
            <Section icon="📚" title="Formation demandée">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Formation"    value={inscription.formation} />
                <Field label="Mode"         value={inscription.mode} />
                <Field label="Disponibilité" value={inscription.disponibilite} />
                <Field
                  label="Niveau scolaire"
                  value={
                    inscription.niveauId
                      ? `${inscription.niveauId.nom}${inscription.niveauId.equivalenceFrance ? ` — ${inscription.niveauId.equivalenceFrance} (FR)` : ''}`
                      : null
                  }
                />
              </div>
            </Section>

            {/* ── Informations personnelles ── */}
            <Section icon="👤" title="Informations personnelles">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Prénom"   value={inscription.prenom} />
                <Field label="Nom"      value={inscription.nom} />
                <Field label="Email"    value={inscription.email} />
                <Field label="Téléphone" value={inscription.tel} />
                <Field label="Source de découverte" value={inscription.sourceDecouverte} />
              </div>
            </Section>

            {/* ── Dates ── */}
            <Section icon="📅" title="Dates">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field
                  label="Date de demande"
                  value={inscription.createdAt
                    ? new Date(inscription.createdAt).toLocaleDateString('fr-FR', {
                        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                      })
                    : null}
                />
                <Field
                  label="Dernière mise à jour"
                  value={inscription.updatedAt
                    ? new Date(inscription.updatedAt).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'long', year: 'numeric',
                      })
                    : null}
                />
              </div>
            </Section>

            {/* ── Commentaire admin ── */}
            {inscription.commentaireAdmin && (
              <div style={{
                background:   'rgba(255,215,0,0.07)',
                border:       '1px solid rgba(255,215,0,0.25)',
                borderRadius: '14px',
                padding:      '20px',
              }}>
                <h2 className="text-xs font-semibold uppercase tracking-widest mb-3 flex items-center gap-2"
                  style={{ color: '#FFD700' }}>
                  💬 Message de l'équipe
                </h2>
                <p className="text-sm leading-relaxed whitespace-pre-line"
                  style={{ color: 'rgba(255,215,0,0.85)' }}>
                  {inscription.commentaireAdmin}
                </p>
              </div>
            )}

            {/* ── CTA si validé ── */}
            {statut === 'Validé' && (
              <div style={{
                background:   'rgba(0,255,209,0.08)',
                border:       '1px solid rgba(0,255,209,0.3)',
                borderRadius: '14px',
                padding:      '24px',
                textAlign:    'center',
              }}>
                <p className="text-lg font-bold mb-1" style={{ color: 'var(--brand-white)' }}>
                  🎉 Votre accès est activé !
                </p>
                <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
                  Vous pouvez maintenant accéder à vos cours et séances.
                </p>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="brand-btn"
                  style={{
                    background:   'linear-gradient(90deg, #00FFD1, #00AAFF)',
                    color:        '#001830',
                    border:       'none',
                    fontWeight:   700,
                  }}
                >
                  Accéder à ma formation →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
