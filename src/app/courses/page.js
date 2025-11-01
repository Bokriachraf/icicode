'use client'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { listCourses } from '@/redux/actions/courseActions'
import Link from 'next/link'

export default function CourseListScreen() {
  const dispatch = useDispatch()
  const courseList = useSelector((state) => state.courseList || {})
  const { loading, error, courses = [] } = courseList

  // Filtres & pagination
  const [levelFilter, setLevelFilter] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const coursesPerPage = 4

  useEffect(() => {
    dispatch(listCourses())
  }, [dispatch])

  // Filtrage
  const filteredCourses = courses.filter((c) => {
    const matchLevel = levelFilter ? c.level === levelFilter : true
    const matchSubject = subjectFilter ? c.subject === subjectFilter : true
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.chapter.toLowerCase().includes(search.toLowerCase())
    return matchLevel && matchSubject && matchSearch
  })

  // Pagination
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage)
  const startIndex = (page - 1) * coursesPerPage
  const paginatedCourses = filteredCourses.slice(
    startIndex,
    startIndex + coursesPerPage
  )

  return (
    <div className="max-w-5xl mx-auto py-24 p-6">
      <h1 className="text-2xl font-bold mb-4">Catalogue des cours</h1>

      {/* Zone filtres */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Filtre niveau */}
        <select
          value={levelFilter}
          onChange={(e) => {
            setLevelFilter(e.target.value)
            setPage(1)
          }}
          className="border p-2 rounded w-full md:w-1/3"
        >
          <option value="">Tous niveaux</option>
          <option value="Bac Tunisien">Bac Tunisien</option>
          <option value="Bac Français">Bac Français</option>
        </select>

        {/* Filtre matière */}
        <select
          value={subjectFilter}
          onChange={(e) => {
            setSubjectFilter(e.target.value)
            setPage(1)
          }}
          className="border p-2 rounded w-full md:w-1/3"
        >
          <option value="">Toutes matières</option>
          <option value="Mathématiques">Mathématiques</option>
          <option value="Python">Python</option>
        </select>

        {/* Barre recherche */}
        <input
          type="text"
          placeholder="Rechercher par titre ou chapitre..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="border p-2 rounded w-full md:flex-1"
        />
      </div>

      {/* Résultats */}
      {loading && <p>Chargement...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && paginatedCourses.length === 0 && (
        <p className="text-gray-500">Aucun cours trouvé</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paginatedCourses.map((course) => (
          <div
            key={course._id}
            className="border p-4 rounded-lg shadow hover:shadow-lg transition"
          >
            <h2 className="font-semibold text-lg">{course.title}</h2>
            <p className="text-sm text-gray-600">{course.level}</p>
            <p className="text-gray-700 mt-2 line-clamp-3">
              {course.description}
            </p>

            <span className="inline-block mt-3 px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded">
              {course.subject}
            </span>

            <div className="mt-4">
              <Link
                href={`/courses/${course._id}`}
                className="text-blue-600 hover:underline font-medium"
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
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            ← Précédent
          </button>

          <span>
            Page {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className={`px-4 py-2 rounded ${
              page === totalPages
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Suivant →
          </button>
        </div>
      )}
    </div>
  )
}


