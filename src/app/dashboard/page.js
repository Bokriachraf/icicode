"use client";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { listMyInscription } from "@/redux/actions/inscriptionActions";
import { useSearchParams } from "next/navigation";

import {
  Loader2,
  GraduationCap,
  Layers,
  BookOpen,
  ArrowLeft,
  User,
  Users,
  Library,
  TrendingUp,
  MessageSquare,
} from "lucide-react";
import FormationDashboard from "@/components/FormationDashboard";

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.userSignin || {});
  const inscriptionListMy = useSelector((state) => state.inscriptionListMy || {});
  const { loading, error, inscription } = inscriptionListMy || {};
  const [selectedFormation, setSelectedFormation] = useState(null);
const searchParams = useSearchParams();
const formationParam = searchParams.get("formation");
  useEffect(() => {
    if (!userInfo) {
      router.push("/login?redirect=/dashboard");
    } else {
      dispatch(listMyInscription());
    }
  }, [dispatch, userInfo, router]);
  useEffect(() => {
  if (formationParam) {
    setSelectedFormation(decodeURIComponent(formationParam));
  }
}, [formationParam]);

  if (!userInfo) return <p className="text-center mt-20">Chargement...</p>;
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Chargement de ton espace...
      </div>
    );
  if (error)
    return <p className="text-center text-red-600 mt-20">Erreur : {error}</p>;

  if (!inscription || inscription.length === 0) {
    return (
      <div className="p-6 text-center mt-20">
        <h1 className="text-2xl font-bold mb-2">Bienvenue, {userInfo.name} 👋</h1>
        <p className="text-gray-600">
          Aucune formation n’est encore associée à ton compte.
        </p>
      </div>
    );
  }

  if (inscription.length > 1 && !selectedFormation) {
    return (
      <div className="p-6 pt-24 pb-24">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center mb-6"
        >
          Salut {userInfo.name} 👋
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center text-gray-600 mb-8"
        >
          Choisis une formation pour accéder à ton tableau de bord :
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inscription.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedFormation(item.formation)}
              className="cursor-pointer p-6 bg-white rounded-xl shadow hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-3 mb-2">
                <GraduationCap className="text-blue-500" />
                <h2 className="text-lg font-semibold">{item.formation}</h2>
              </div>
              <p className="text-gray-500 text-sm">
                Statut :
                <span
                  className={`ml-1 ${
                    item.status === "Validé"
                      ? "text-green-600"
                      : item.status === "En cours"
                      ? "text-orange-500"
                      : "text-blue-500"
                  }`}
                >
                  {item.status}
                </span>
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  const formation =
    selectedFormation || (inscription.length === 1 && inscription[0].formation);

  const inscriptionActive = inscription.find(
    (i) => i.formation === formation
  );

  return (
    <motion.div
      className="p-6 pt-24 pb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          Tableau de bord – {formation} 💻
        </h1>

        {inscription.length > 1 && (
          <button
            onClick={() => setSelectedFormation(null)}
            className="flex items-center gap-2 text-blue-600 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Changer de formation
          </button>
        )}
      </div>

      {/* En-tête formation */}
      <FormationDashboard
        formation={formation}
        inscription={inscriptionActive}
        userInfo={userInfo}
      />

      {/* Section enrichie */}
      <motion.div
        className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="p-5 bg-white rounded-xl shadow hover:shadow-lg transition">
          <BookOpen className="text-indigo-500 mb-2" />
          <h2 className="font-semibold mb-1">Progression</h2>
          <p className="text-sm text-gray-600">
            Avancement global : <strong>45%</strong> 📈
          </p>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-indigo-500 h-2 rounded-full w-[45%]"></div>
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl shadow hover:shadow-lg transition">
          <User className="text-green-500 mb-2" />
          <h2 className="font-semibold mb-1">Mon profil</h2>
          <p className="text-sm text-gray-600">
            <strong>{userInfo.name}</strong> <br />
            {userInfo.email}
          </p>
        </div>

        <div className="p-5 bg-white rounded-xl shadow hover:shadow-lg transition">
          <Library className="text-teal-500 mb-2" />
          <h2 className="font-semibold mb-1">Ressources</h2>
          <p className="text-sm text-gray-600">
            Consulte les supports PDF, vidéos et tutos liés à ta formation.
          </p>
        </div>

        <div className="p-5 bg-white rounded-xl shadow hover:shadow-lg transition">
          <Users className="text-yellow-500 mb-2" />
          <h2 className="font-semibold mb-1">Communauté</h2>
          <p className="text-sm text-gray-600">
            Échange avec d’autres étudiants de ta formation.
          </p>
        </div>

        <div className="p-5 bg-white rounded-xl shadow hover:shadow-lg transition">
          <TrendingUp className="text-blue-500 mb-2" />
          <h2 className="font-semibold mb-1">Objectifs</h2>
          <p className="text-sm text-gray-600">
            Tes modules à compléter cette semaine : <strong>2</strong> 🕒
          </p>
        </div>

        <div className="p-5 bg-white rounded-xl shadow hover:shadow-lg transition">
          <MessageSquare className="text-pink-500 mb-2" />
          <h2 className="font-semibold mb-1">Assistance</h2>
          <p className="text-sm text-gray-600">
            Besoin d’aide ? Contacte ton formateur ou l’équipe support.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}


