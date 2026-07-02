"use client";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CourseDetailPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const formation = searchParams.get("formation");

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

  if (loading) return <p className="min-h-screen pt-24 text-center" style={{ color: 'var(--text-secondary)' }}>Chargement...</p>;
  if (error) return <p className="min-h-screen pt-24 text-center text-red-400">{error}</p>;
  if (!course) return <p className="min-h-screen pt-24 text-center" style={{ color: 'var(--text-secondary)' }}>Aucun cours trouvé.</p>;

  return (
    <div className="py-24 max-w-2xl mx-auto p-6 min-h-screen">
      <div className="brand-card p-6">
        <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--brand-white)' }}>{course.title}</h1>
        <p style={{ color: 'var(--text-secondary)' }}><strong style={{ color: 'var(--brand-white)' }}>Matière :</strong> {course.subject}</p>
        <p style={{ color: 'var(--text-secondary)' }}><strong style={{ color: 'var(--brand-white)' }}>Niveau :</strong> {course.level}</p>
        <p style={{ color: 'var(--text-secondary)' }}><strong style={{ color: 'var(--brand-white)' }}>Chapitre :</strong> {course.chapter}</p>

        {course.description && (
          <p className="mt-2 italic" style={{ color: 'var(--text-secondary)' }}>{course.description}</p>
        )}

        <div className="mt-4 p-4 border rounded whitespace-pre-line" style={{ borderColor: 'var(--border-card)', background: 'rgba(255,255,255,0.03)', color: 'var(--text-secondary)' }}>
          {course.content}
        </div>

        <Link
          href={
            formation
              ? `/dashboard?formation=${encodeURIComponent(formation)}`
              : `/dashboard`
          }
          className="inline-block mt-6 font-semibold hover:underline"
          style={{ color: 'var(--brand-cyan)' }}
        >
          ← Retour à {formation ? `la formation ${formation}` : "mon tableau de bord"}
        </Link>
      </div>
    </div>
  );
}
