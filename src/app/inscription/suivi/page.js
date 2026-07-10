"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listMyInscription } from "../../../redux/actions/inscriptionActions";
import { Loader2 } from "lucide-react";

const statutConfig = {
  'En attente': {
    border: 'rgba(74,144,226,0.35)',
    bg:     'rgba(74,144,226,0.08)',
    color:  '#4A90E2',
    emoji:  '⏳',
  },
  'En cours': {
    border: 'rgba(255,165,0,0.35)',
    bg:     'rgba(255,165,0,0.08)',
    color:  '#FFA500',
    emoji:  '🔄',
  },
  'Validé': {
    border: 'rgba(0,255,209,0.35)',
    bg:     'rgba(0,255,209,0.08)',
    color:  '#00FFD1',
    emoji:  '✅',
  },
  'Rejeté': {
    border: 'rgba(255,80,80,0.35)',
    bg:     'rgba(255,80,80,0.08)',
    color:  '#FF6B6B',
    emoji:  '❌',
  },
}

const Tag = ({ children }) => (
  <span style={{
    background:   'rgba(255,255,255,0.05)',
    border:       '1px solid rgba(255,255,255,0.12)',
    borderRadius: '8px',
    padding:      '3px 10px',
    fontSize:     '0.75rem',
    color:        'var(--text-secondary)',
  }}>
    {children}
  </span>
)

export default function SuiviInscriptionPage() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((s) => s.userSignin || {});
  const { loading, inscription, error } = useSelector((s) => s.inscriptionListMy || {});

  useEffect(() => {
    if (userInfo) dispatch(listMyInscription());
  }, [dispatch, userInfo]);

  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="brand-card p-8 text-center max-w-sm w-full">
          <p className="text-4xl mb-4">🔒</p>
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--brand-white)' }}>
            Connexion requise
          </h2>
          <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
            Connectez-vous pour suivre vos inscriptions.
          </p>
          <Link href="/signin" className="brand-btn" style={{ display: 'inline-flex' }}>
            Se connecter →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 pt-24 pb-24 max-w-3xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--brand-white)' }}>
          Mes inscriptions
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
          Suivez l'état de vos demandes de formation
        </p>
        <hr className="brand-divider" />
      </div>

      {/* Bandeau dashboard */}
      <div style={{
        background:   'linear-gradient(135deg, rgba(0,255,209,0.08), rgba(0,170,255,0.08))',
        border:       '1px solid rgba(0,255,209,0.2)',
        borderRadius: '14px',
        padding:      '20px 24px',
        marginBottom: '24px',
        display:      'flex',
        alignItems:   'center',
        justifyContent: 'space-between',
        flexWrap:     'wrap',
        gap:          '16px',
      }}>
        <div>
          <p className="font-semibold text-base" style={{ color: 'var(--brand-white)' }}>
            📊 Votre espace d’apprentissage
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Accédez à vos cours, séances, chapitres, exercices et suivez votre progression.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {[
              { emoji: '📚', label: 'Chapitres' },
              { emoji: '📹', label: 'Séances live' },
              { emoji: '📊', label: 'Progression' },
              { emoji: '📄', label: 'Plans tarifaires' },
            ].map(({ emoji, label }) => (
              <span key={label} style={{
                background:   'rgba(255,255,255,0.05)',
                border:       '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding:      '3px 10px',
                fontSize:     '0.72rem',
                color:        'var(--text-secondary)',
              }}>
                {emoji} {label}
              </span>
            ))}
          </div>
        </div>
        <Link
          href="/dashboard"
          className="brand-btn"
          style={{
            background:  'linear-gradient(90deg, #00FFD1, #00AAFF)',
            color:       '#001830',
            border:      'none',
            fontWeight:  700,
            whiteSpace:  'nowrap',
            flexShrink:  0,
          }}
        >
          Accéder au dashboard →
        </Link>
      </div>

      {/* Loader */}
      {loading && (
        <div className="flex items-center justify-center py-16" style={{ color: 'var(--text-muted)' }}>
          <Loader2 className="animate-spin mr-2" size={18} /> Chargement...
        </div>
      )}

      {/* Erreur */}
      {error && (
        <div className="brand-card p-4 text-center text-sm" style={{ color: '#FF6B6B', borderColor: 'rgba(255,80,80,0.3)' }}>
          {error}
        </div>
      )}

      {/* Vide */}
      {!loading && inscription?.length === 0 && (
        <div className="brand-card p-10 text-center">
          <p className="text-4xl mb-3">📋</p>
          <p className="mb-5 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Aucune inscription pour le moment.
          </p>
          <Link href="/inscription" className="brand-btn-gold brand-btn" style={{ display: 'inline-flex' }}>
            S'inscrire à une formation
          </Link>
        </div>
      )}

      {/* Liste */}
      <div className="flex flex-col gap-4">
        {inscription?.map((item) => {
          const statut = item.status || 'En attente'
          const sc = statutConfig[statut] || statutConfig['En attente']

          return (
            <div
              key={item._id}
              style={{
                background:   sc.bg,
                border:       `1px solid ${sc.border}`,
                borderRadius: '14px',
                padding:      '20px',
                transition:   'transform 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex-1 space-y-3">

                  {/* Statut badge */}
                  <div className="flex items-center gap-2">
                    <span style={{
                      background:   sc.bg,
                      border:       `1px solid ${sc.border}`,
                      color:        sc.color,
                      borderRadius: '6px',
                      padding:      '3px 10px',
                      fontSize:     '0.75rem',
                      fontWeight:   600,
                      letterSpacing: '0.05em',
                    }}>
                      {sc.emoji} {statut}
                    </span>
                  </div>

                  {/* Formation */}
                  <h2 className="text-base font-bold" style={{ color: 'var(--brand-white)' }}>
                    {item.formation || 'Formation non spécifiée'}
                  </h2>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {item.mode     && <Tag>🖥️ {item.mode}</Tag>}
                    {item.niveauId && <Tag>🎓 {item.niveauId.nom}</Tag>}
                    {item.createdAt && (
                      <Tag>📅 {new Date(item.createdAt).toLocaleDateString('fr-FR')}</Tag>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 items-end">
                  <Link
                    href={`/inscription/${item._id}`}
                    className="text-sm font-medium hover:underline"
                    style={{ color: 'var(--brand-cyan)' }}
                  >
                    Voir les détails →
                  </Link>
                  {statut === 'Validé' && (
                    <Link href="/dashboard" className="brand-btn brand-btn-gold text-sm" style={{ display: 'inline-flex' }}>
                      Accéder →
                    </Link>
                  )}
                </div>
              </div>

              {/* Message contextuel */}
              {statut === 'En attente' && (
                <p className="mt-3 text-xs italic" style={{ color: '#4A90E2', opacity: 0.85 }}>
                  Votre demande est en cours d'examen. Vous serez notifié dès qu'elle sera traitée.
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  );
}
