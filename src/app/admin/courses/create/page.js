'use client'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createCourse } from '@/redux/actions/courseActions'

export default function CourseCreateScreen() {
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [level, setLevel] = useState('')
  const [chapter, setChapter] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
 const [formation, setFormation] = useState('')

  const dispatch = useDispatch()

  const courseCreate = useSelector((state) => state.courseCreate || {})
  const { loading, error, success } = courseCreate

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(createCourse({ title, subject, level, chapter, description, content, formation }))
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
      <h1 className="text-2xl font-bold mb-4">Ajouter un cours</h1>

      {loading && <p>Création en cours...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-600">Cours ajouté avec succès ✅</p>}

      <form onSubmit={submitHandler} className="space-y-4">
        <input
          type="text"
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
<select
  value={formation}
  onChange={(e) => setFormation(e.target.value)}
  className="w-full border rounded p-2"
  required
>
  <option value="">-- Choisir une formation --</option>
  <option value="Developpement web">Developpement web</option>
  <option value="Mathématiques & Python">Mathématiques & Python</option>
  <option value="Ai & Machine learning">Ai & Machine learning</option>
</select>
        {/* ✅ Matière avec select */}
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full border rounded p-2"
          required
        >
          <option value="">-- Choisir une matière --</option>
          <option value="Mathématiques">Mathématiques</option>
          <option value="Python">Python</option>
        </select>

        {/* ✅ Niveau avec select */}
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="w-full border rounded p-2"
          required
        >
          <option value="">-- Choisir un niveau --</option>
          <option value="Bac Français">Bac Français</option>
          <option value="Bac Tunisien">Bac Tunisien</option>
        </select>

        <input
          type="text"
          placeholder="Chapitre"
          value={chapter}
          onChange={(e) => setChapter(e.target.value)}
          className="w-full border rounded p-2"
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded p-2"
          required
        ></textarea>

        <textarea
          placeholder="Contenu (texte ou code)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border rounded p-2 h-40"
          required
        ></textarea>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700"
        >
          Ajouter
        </button>
      </form>
    </div>
  )
}
