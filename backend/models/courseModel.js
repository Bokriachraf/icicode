// backend/models/Course.js
import mongoose from 'mongoose'

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },         // ex: "Suites numériques - Chapitre 1"
  subject: { type: String, enum: ['Mathématiques', 'Python'], required: true },
  level: { type: String, enum: ['Bac Français', 'Bac Tunisien'], required: true },
  chapter: { type: String, required: true },       // ex: "Suites"
  description: { type: String },
  content: { type: String },                       // contenu en Markdown ou HTML
  formation: { type: String, required: true },
  linkedCourse: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' } // cours parallèle
}, { timestamps: true })

export default mongoose.model('Course', courseSchema)
