"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Layers,
  BookOpen,
  Brain,
  BarChart,
  Gamepad2,
  Globe,
  Users,
  Book,
} from "lucide-react";
import Link from "next/link";

export default function FormationDashboard({ formation, inscription, userInfo }) {
  const [showCourses, setShowCourses] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [errorCourses, setErrorCourses] = useState(null);

  // 🎯 Styles dynamiques selon formation (AJOUT: "Mathématiques & Python")
  const formationStyles = {
    "Développement Web": {
      color: "bg-blue-50",
      accent: "text-blue-600",
      icon: <Globe className="w-8 h-8 text-blue-500" />,
    },
    "IA & Machine Learning": {
      color: "bg-violet-50",
      accent: "text-violet-600",
      icon: <Brain className="w-8 h-8 text-violet-500" />,
    },
    "Data Science": {
      color: "bg-teal-50",
      accent: "text-teal-600",
      icon: <BarChart className="w-8 h-8 text-teal-500" />,
    },
    "Data Analysis": {
      color: "bg-cyan-50",
      accent: "text-cyan-600",
      icon: <BarChart className="w-8 h-8 text-cyan-500" />,
    },
    "Gaming": {
      color: "bg-orange-50",
      accent: "text-orange-600",
      icon: <Gamepad2 className="w-8 h-8 text-orange-500" />,
    },
    "Digital Marketing": {
      color: "bg-pink-50",
      accent: "text-pink-600",
      icon: <Users className="w-8 h-8 text-pink-500" />,
    },
    "Management": {
      color: "bg-yellow-50",
      accent: "text-yellow-600",
      icon: <Layers className="w-8 h-8 text-yellow-500" />,
    },
    // ← AJOUT
    "Mathématiques & Python": {
      color: "bg-indigo-50",
      accent: "text-indigo-600",
      icon: <Book className="w-8 h-8 text-indigo-500" />,
    },
  };

  const style = formationStyles[formation] || formationStyles["Développement Web"];

  // 📚 Liste des modules
  const modules = [
    { title: "Introduction", description: "Découvre les bases et la roadmap." },
    { title: "Modules pratiques", description: "Mets en œuvre les notions clés." },
    {
      title: "Quiz & Évaluations",
      description: "Teste tes connaissances et suis ta progression.",
    },
    {
      title: "Ressources",
      description: "Accède aux cours et supports liés à ta formation.",
      clickable: true,
    },
  ];

  // 🔄 Charger les cours liés à la formation
  useEffect(() => {
    if (!showCourses) return;
    const fetchCourses = async () => {
      try {
        setLoadingCourses(true);
        const res = await fetch("http://localhost:5000/api/courses");
        if (!res.ok) throw new Error("Erreur lors du chargement des cours");
        const data = await res.json();
        // 🎯 Filtrer selon la formation de l’étudiant
        // On compare soit le champ `formation` du cours, soit (pour compatibilité) le champ `level`
        const filtered = data.filter(
          (course) =>
            (course.formation && course.formation === formation) ||
            (course.level && course.level === formation)
        );
        setCourses(filtered);
      } catch (err) {
        setErrorCourses(err.message);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, [showCourses, formation]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-2xl shadow ${style.color}`}
    >
      {/* ---- En-tête ---- */}
      <div className="flex items-center gap-4 mb-6">
        {style.icon}
        <div>
          <h2 className={`text-xl font-bold ${style.accent}`}>{formation}</h2>
          <p className="text-gray-600 text-sm">
            Statut : {inscription?.status || "En attente"}
          </p>
        </div>
      </div>

      {/* ---- Modules ---- */}
      {!showCourses ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map((mod, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              onClick={() => mod.clickable && setShowCourses(true)}
              className={`p-5 bg-white rounded-xl shadow hover:shadow-lg transition ${
                mod.clickable ? "cursor-pointer" : ""
              }`}
            >
              <h3 className="font-semibold mb-1">{mod.title}</h3>
              <p className="text-sm text-gray-600">{mod.description}</p>
              {mod.clickable && (
                <p className="mt-2 text-blue-600 text-sm font-medium">
                  → Voir les ressources
                </p>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        /* ---- Section des cours ---- */
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">📚 Ressources disponibles</h3>
            <button
              onClick={() => setShowCourses(false)}
              className="text-blue-600 hover:underline text-sm"
            >
              ← Retour aux modules
            </button>
          </div>

          {loadingCourses && <p>Chargement des cours...</p>}
          {errorCourses && <p className="text-red-500">{errorCourses}</p>}
          {!loadingCourses && courses.length === 0 && (
            <p className="text-gray-500">Aucun cours trouvé pour cette formation.</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course) => (
              <motion.div
                key={course._id}
                whileHover={{ scale: 1.02 }}
                className="p-5 bg-white rounded-xl shadow hover:shadow-lg transition"
              >
                <h4 className="font-semibold text-lg mb-1">{course.title}</h4>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {course.description}
                </p>
                <p className="text-xs text-gray-500 mt-1">Chapitre : {course.chapter}</p>
                 <Link
                 href={`/courses/${course._id}?formation=${encodeURIComponent(formation)}`}
                 className="inline-block mt-3 text-blue-600 hover:underline text-sm font-medium"
                   >
                 Voir le cours →
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ---- Infos utilisateur ---- */}
      <p className="mt-6 text-gray-500 text-sm">
        Étudiant : <span className="font-medium">{userInfo.name}</span> | Email :{" "}
        <span className="text-gray-700">{userInfo.email}</span>
      </p>
    </motion.div>
  );
}
