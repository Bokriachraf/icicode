'use client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { listSeances } from '../../redux/actions/seanceActions';

const statutColors = {
  planifiée: 'bg-blue-50 text-blue-700 border-blue-200',
  en_cours: 'bg-green-50 text-green-700 border-green-200',
  terminée: 'bg-gray-100 text-gray-500 border-gray-200',
  annulée: 'bg-red-50 text-red-600 border-red-200',
};

const statutLabels = {
  planifiée: '📅 Planifiée',
  en_cours: '🔴 En cours',
  terminée: '✅ Terminée',
  annulée: '❌ Annulée',
};

export default function SeancesPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { userInfo } = useSelector((state) => state.userSignin);
  const { loading, seances = [], error } = useSelector((state) => state.seanceList);

  useEffect(() => {
    if (!userInfo) { router.push('/signin'); return; }
    dispatch(listSeances(userInfo.niveauId || null));
  }, [dispatch, userInfo]);

  if (!userInfo) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 md:px-10">

      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <button
          onClick={() => router.back()}
          className="text-sm text-indigo-600 hover:underline mb-2"
        >
          ← Retour
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-indigo-800">
          Mes séances
        </h1>
        <p className="text-gray-500 mt-1">
          Toutes vos séances en ligne avec votre professeur
        </p>
      </motion.div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Chargement...</div>
      ) : error ? (
        <div className="text-center py-16 text-red-500">{error}</div>
      ) : seances.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          Aucune séance planifiée pour votre niveau.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {seances.map((seance, i) => (
            <motion.div
              key={seance._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex flex-col gap-2">
                {/* Statut */}
                <span className={`self-start text-xs font-semibold px-3 py-1 rounded-full border ${statutColors[seance.statut]}`}>
                  {statutLabels[seance.statut]}
                </span>

                {/* Titre */}
                <h2 className="text-lg font-bold text-gray-800">{seance.titre}</h2>

                {/* Infos */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span>
                    📅 {new Date(seance.dateHeure).toLocaleDateString('fr-FR', {
                      weekday: 'long', day: 'numeric', month: 'long',
                    })}
                  </span>
                  <span>
                    🕐 {new Date(seance.dateHeure).toLocaleTimeString('fr-FR', {
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </span>
                  <span>⏱ {seance.duree} min</span>
                  {seance.chapitreId && (
                    <span>📐 {seance.chapitreId.titre}</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 flex-shrink-0">
                {seance.statut === 'terminée' && seance.replayUrl && (
                  <a
                    href={seance.replayUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
                  >
                    🎥 Replay
                  </a>
                )}
                {(seance.statut === 'planifiée' || seance.statut === 'en_cours') && (
                  <Link href={`/seances/${seance._id}`}>
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition"
                    >
                      Rejoindre →
                    </motion.button>
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
