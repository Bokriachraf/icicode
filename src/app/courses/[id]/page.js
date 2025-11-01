"use client";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CourseDetailPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const formation = searchParams.get("formation"); // 🎯 Récupère la formation depuis l’URL

  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchCourse = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/courses/${id}`);
        if (!res.ok) throw new Error("Cours non trouvé ❌");
        const data = await res.json();
        setCourse(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!course) return <p>Aucun cours trouvé.</p>;

  return (
    <div className="py-24 max-w-2xl mx-auto p-6 bg-white shadow-md rounded-xl">
      <h1 className="text-2xl font-bold mb-4">{course.title}</h1>
      <p><strong>Matière :</strong> {course.subject}</p>
      <p><strong>Niveau :</strong> {course.level}</p>
      <p><strong>Chapitre :</strong> {course.chapter}</p>

      {course.description && (
        <p className="mt-2 text-gray-700 italic">{course.description}</p>
      )}

      <div className="mt-4 p-4 border rounded bg-gray-50 whitespace-pre-line">
        {course.content}
      </div>

      {/* 🧭 Retour dynamique vers le bon tableau de bord */}
      <Link
        href={
          formation
            ? `/dashboard?formation=${encodeURIComponent(formation)}`
            : `/dashboard`
        }
        className="inline-block mt-6 text-blue-600 font-semibold hover:underline"
      >
        ← Retour à {formation ? `la formation ${formation}` : "mon tableau de bord"}
      </Link>
    </div>
  );
}



// "use client";
// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";

// export default function CourseDetailPage() {
//   const { id } = useParams();
//   const [course, setCourse] = useState(null);

//   useEffect(() => {
//     fetch(`http://localhost:5000/api/courses/${id}`)
//       .then((res) => res.json())
//       .then((data) => setCourse(data));
//   }, [id]);

//   if (!course) return <p>Chargement...</p>;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">{course.title}</h1>
//       <p><strong>Niveau :</strong> {course.level}</p>
//       <p><strong>Chapitre :</strong> {course.chapter}</p>
//       <div className="mt-4">{course.content}</div>

//       <a
//         href="/courses"
//         className="inline-block mt-6 text-blue-600 hover:underline"
//       >
//         ← Retour à la liste
//       </a>
//     </div>
//   );
// }
