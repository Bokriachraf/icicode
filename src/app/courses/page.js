'use client'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { listCourses } from '@/redux/actions/courseActions'
import Link from 'next/link'

export default function CourseListScreen() {
  const dispatch = useDispatch()
  const courseList = useSelector((state) => state.courseList || {})
  const { loading, error, courses = [] } = courseList

  const [levelFilter, setLevelFilter] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const coursesPerPage = 4

  useEffect(() => {
    dispatch(listCourses())
  }, [dispatch])

  const filteredCourses = courses.filter((c) => {
    const matchLevel = levelFilter ? c.level === levelFilter : true
    const matchSubject = subjectFilter ? c.subject === subjectFilter : true
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.chapter.toLowerCase().includes(search.toLowerCase())
    return matchLevel && matchSubject && matchSearch
  })

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage)
  const startIndex = (page - 1) * coursesPerPage
  const paginatedCourses = filteredCourses.slice(
    startIndex,
    startIndex + coursesPerPage
  )

  return (
    <div className="max-w-5xl mx-auto py-24 p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--brand-white)' }}>Catalogue des cours</h1>

      {/* Zone filtres */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <select
          value={levelFilter}
          onChange={(e) => {
            setLevelFilter(e.target.value)
            setPage(1)
          }}
          className="border p-2 rounded w-full md:w-1/3 bg-white text-gray-800"
        >
          <option value="">Tous niveaux</option>
          <option value="Bac Tunisien">Bac Tunisien</option>
          <option value="Bac Français">Bac Français</option>
        </select>

        <select
          value={subjectFilter}
          onChange={(e) => {
            setSubjectFilter(e.target.value)
            setPage(1)
          }}
          className="border p-2 rounded w-full md:w-1/3 bg-white text-gray-800"
        >
          <option value="">Toutes matières</option>
          <option value="Mathématiques">Mathématiques</option>
          <option value="Python">Python</option>
        </select>

        <input
          type="text"
          placeholder="Rechercher par titre ou chapitre..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="border p-2 rounded w-full md:flex-1 bg-white text-gray-800"
        />
      </div>

      {/* Résultats */}
      {loading && <p style={{ color: 'var(--text-secondary)' }}>Chargement...</p>}
      {error && <p className="text-red-400">{error}</p>}
      {!loading && paginatedCourses.length === 0 && (
        <p style={{ color: 'var(--text-muted)' }}>Aucun cours trouvé</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paginatedCourses.map((course) => (
          <div
            key={course._id}
            className="brand-card p-4"
          >
            <h2 className="font-semibold text-lg" style={{ color: 'var(--brand-white)' }}>{course.title}</h2>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{course.level}</p>
            <p className="mt-2 line-clamp-3" style={{ color: 'var(--text-secondary)' }}>
              {course.description}
            </p>

            <span className="brand-badge brand-badge-blue inline-block mt-3">
              {course.subject}
            </span>

            <div className="mt-4">
              <Link
                href={`/courses/${course._id}`}
                className="font-medium hover:underline"
                style={{ color: 'var(--brand-cyan)' }}
              >
                Voir le cours →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={`px-4 py-2 rounded ${
              page === 1
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'brand-btn'
            }`}
          >
            ← Précédent
          </button>

          <span style={{ color: 'var(--text-secondary)' }}>
            Page {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className={`px-4 py-2 rounded ${
              page === totalPages
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'brand-btn'
            }`}
          >
            Suivant →
          </button>
        </div>
      )}
    </div>
  )
}
