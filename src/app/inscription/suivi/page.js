"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listMyInscription } from "../../../redux/actions/inscriptionActions";
import { Loader2 } from "lucide-react";

const statutConfig = {
  'En attente': { bg: 'bg-blue-50',   text: 'text-blue-700',  border: 'border-blue-200',  emoji: '⏳' },
  'En cours':   { bg: 'bg-orange-50', text: 'text-orange-700',border: 'border-orange-200',emoji: '🔄' },
  'Validé':     { bg: 'bg-green-50',  text: 'text-green-700', border: 'border-green-200', emoji: '✅' },
  'Rejeté':     { bg: 'bg-red-50',    text: 'text-red-700',   border: 'border-red-200',   emoji: '❌' },
}

export default function SuiviInscriptionPage() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.userSignin || {});
  const { loading, inscription, error } = useSelector((state) => state.inscriptionListMy || {});

  useEffect(() => {
    if (userInfo) dispatch(listMyInscription());
  }, [dispatch, userInfo]);

  if (!userInfo) {
    return (
      <div className="p-6 text-center text-gray-600 mt-20">
        <h2 className="text-xl font-semibold mb-3">Connexion requise</h2>
        <Link href="/signin" className="text-blue-600 hover:underline">
          Se connecter
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 pt-24 pb-24 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Mes inscriptions
        </h1>
        <p className="text-gray-400 mt-1 text-sm">
          Suivez l'état de vos demandes de formation
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader2 className="animate-spin mr-2" /> Chargement...
        </div>
      )}

      {error && (
        <div className="text-red-500 text-center py-8">{error}</div>
      )}

      {!loading && inscription?.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📋</p>
          <p>Aucune inscription pour le moment.</p>
          <Link href="/inscription"
            className="mt-4 inline-block bg-green-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-green-700 transition">
            S'inscrire à une formation
          </Link>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {inscription?.map((item) => {
          const statut = item.status || 'En attente'
          const sc = statutConfig[statut] || statutConfig['En attente']

          return (
            <div key={item._id}
              className={`rounded-2xl border-2 p-5 ${sc.bg} ${sc.border} transition hover:shadow-sm`}
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex-1 space-y-2">

                  {/* Statut */}
                  <div className={`flex items-center gap-1.5 font-semibold text-sm ${sc.text}`}>
                    <span>{sc.emoji}</span>
                    <span>{statut}</span>
                  </div>

                  {/* Formation */}
                  <h2 className="text-base font-bold text-gray-800">
                    {item.formation || 'Formation non spécifiée'}
                  </h2>

                  {/* Infos */}
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                    {item.mode && (
                      <span className="bg-white border border-gray-200 px-2 py-1 rounded-lg">
                        🖥️ {item.mode}
                      </span>
                    )}
                    {item.niveauId && (
                      <span className="bg-white border border-gray-200 px-2 py-1 rounded-lg">
                        🎓 {item.niveauId.nom}
                      </span>
                    )}
                    {item.createdAt && (
                      <span className="bg-white border border-gray-200 px-2 py-1 rounded-lg">
                        📅 {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 items-end">
                  <Link href={`/inscription/${item._id}`}
                    className="text-sm text-indigo-600 hover:underline font-medium">
                    Voir les détails →
                  </Link>
                  {statut === 'Validé' && (
                    <Link href="/dashboard"
                      className="text-sm bg-green-600 text-white px-4 py-1.5 rounded-lg hover:bg-green-700 transition font-medium">
                      Accéder →
                    </Link>
                  )}
                </div>
              </div>

              {/* Message si en attente */}
              {statut === 'En attente' && (
                <p className="mt-3 text-xs text-blue-600 opacity-80 italic">
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
