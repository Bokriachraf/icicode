'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { listChapitres } from '../../redux/actions/chapitreActions';
import { listSeances } from '../../redux/actions/seanceActions';
import Axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function Dashboard() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { userInfo } = useSelector((state) => state.userSignin);
  const { loading: loadingChapitres, chapitres = [] } = useSelector((state) => state.chapitreList);
  const { loading: loadingSeances, seances = [] } = useSelector((state) => state.seanceList);
  const [abonnementsActifs, setAbonnementsActifs] = useState(new Set()); // Set de niveauId
  const [aAuMoinsUnAbonnement, setAAuMoinsUnAbonnement] = useState(null); // null = pas encore chargé

  useEffect(() => {
    if (!userInfo) return;
    Axios.get(`${API}/api/abonnements/mes`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    })
      .then(({ data }) => {
        const abonnements = Array.isArray(data) ? data : [];
        const actifs = abonnements.filter(a => a.statut === 'actif' && new Date(a.dateEcheance) >= new Date());
        const niveaux = new Set(
          actifs.map(a => (a.planId?.niveauId?._id || a.planId?.niveauId)?.toString()).filter(Boolean)
        );
        setAbonnementsActifs(niveaux);
        setAAuMoinsUnAbonnement(actifs.length > 0);
      })
      .catch(() => { setAbonnementsActifs(new Set()); setAAuMoinsUnAbonnement(false); });
  }, [userInfo]);

  useEffect(() => {
    if (!userInfo) { router.push('/signin'); return; }
    // On charge TOUS les chapitres (pas filtrés à un seul niveau) : un élève peut
    // suivre plusieurs formations, l'intersection avec ses séances fait le tri ensuite.
    if (userInfo.isInscriptionComplete) {
      dispatch(listChapitres());
      dispatch(listSeances());
    }
  }, [dispatch, userInfo]);

  if (!userInfo) return null;

  const prochaine = seances.find((s) => s.statut === 'planifiée');

  // On ne garde que les chapitres réellement rattachés à une séance de l'élève
  // (donc à un groupe dont il est membre) — pas tous les chapitres du niveau.
  const chapitreIdsAssignes = new Set(
    seances
      .map((s) => s.chapitreId?._id || s.chapitreId)
      .filter(Boolean)
      .map((id) => id.toString())
  );
  const mesChapitres = chapitres.filter((c) => chapitreIdsAssignes.has(c._id.toString()));
  const chargement = loadingChapitres || loadingSeances;

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 md:px-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--brand-white)' }}>
          Bonjour, {userInfo.name} 👋
        </h1>
        <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>
          {userInfo.niveauNom || "Votre espace d'apprentissage"}
        </p>
      </motion.div>

      {/* Rappel abonnement si inscrit mais aucun abonnement actif */}
      {userInfo.isInscriptionComplete && aAuMoinsUnAbonnement === false && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          style={{ background: 'linear-gradient(90deg, rgba(255,193,7,0.15), rgba(255,193,7,0.05))', border: '1px solid rgba(255,193,7,0.3)' }}
        >
          <div>
            <p className="text-sm font-medium mb-1" style={{ color: '#FFC107' }}>Activez votre abonnement</p>
            <h2 className="text-lg font-bold" style={{ color: 'var(--brand-white)' }}>Débloquez l'accès complet à vos cours</h2>
          </div>
          <Link href="/abonnement">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="brand-btn whitespace-nowrap">
              Voir les plans →
            </motion.button>
          </Link>
        </motion.div>
      )}

      {/* CTA inscription si pas encore inscrit */}
      {!userInfo.isInscriptionComplete && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-gradient-to-r from-green-700 to-green-500 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div>
            <p className="text-sm font-medium text-green-100 mb-1">Commencez votre formation</p>
            <h2 className="text-xl font-bold text-white">Vous n'êtes pas encore inscrit à une formation</h2>
            <p className="text-sm text-green-100 mt-1">Choisissez votre formation et rejoignez Codalog dès aujourd'hui.</p>
          </div>
          <Link href="/inscription">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="bg-white text-green-700 font-semibold px-6 py-2.5 rounded-xl hover:bg-green-50 transition whitespace-nowrap"
            >
              S'inscrire gratuitement →
            </motion.button>
          </Link>
        </motion.div>
      )}

      {/* Prochaine séance */}
      {prochaine && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="brand-card mb-8 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div>
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--brand-cyan)' }}>Prochaine séance</p>
            <h2 className="text-xl font-bold" style={{ color: 'var(--brand-white)' }}>{prochaine.titre}</h2>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              {new Date(prochaine.dateHeure).toLocaleDateString('fr-FR', {
                weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
              })}
            </p>
          </div>
          <Link href={`/seances/${prochaine._id}`}>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="brand-btn"
            >
              Rejoindre →
            </motion.button>
          </Link>
        </motion.div>
      )}

      {/* Chapitres */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold" style={{ color: 'var(--brand-white)' }}>Mes chapitres</h2>
        <Link href="/seances" className="text-sm hover:underline" style={{ color: 'var(--brand-cyan)' }}>
          Voir toutes les séances →
        </Link>
      </div>

      {chargement ? (
        <div className="text-center py-10" style={{ color: 'var(--text-muted)' }}>Chargement...</div>
      ) : mesChapitres.length === 0 ? (
        <div className="text-center py-10" style={{ color: 'var(--text-muted)' }}>
          Aucun chapitre pour l'instant — il s'affichera ici dès qu'une séance de votre groupe y sera liée.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mesChapitres.map((chapitre, i) => (
            <motion.div
              key={chapitre._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="brand-card p-6 flex flex-col gap-4"
            >
              {/* Numéro + titre */}
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full font-bold text-sm flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(0,255,209,0.12)', color: 'var(--brand-cyan)' }}
                >
                  {chapitre.ordre}
                </div>
                <h3 className="font-semibold text-base leading-tight" style={{ color: 'var(--brand-white)' }}>
                  {chapitre.titre}
                </h3>
              </div>

              {/* Parties Math + Python */}
              <div className="flex gap-2">
                <span className="brand-badge brand-badge-gold">📐 Math</span>
                <span className="brand-badge brand-badge-cyan">🐍 Python</span>
              </div>

              <Link href={abonnementsActifs.has((chapitre.niveauId?._id || chapitre.niveauId)?.toString()) ? `/chapitres/${chapitre._id}` : '/abonnement'}>
                <button className={`w-full justify-center mt-auto ${abonnementsActifs.has((chapitre.niveauId?._id || chapitre.niveauId)?.toString()) ? 'brand-btn' : ''}`}
                  style={!abonnementsActifs.has((chapitre.niveauId?._id || chapitre.niveauId)?.toString()) ? { background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '0.75rem', padding: '0.65rem 1rem', fontWeight: 600, fontSize: '0.875rem' } : {}}>
                  {abonnementsActifs.has((chapitre.niveauId?._id || chapitre.niveauId)?.toString()) ? 'Commencer' : '🔒 Débloquer'}
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
