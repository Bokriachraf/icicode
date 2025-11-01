// backend/seedCourses.js
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Course from './models/courseModel.js'

dotenv.config()
mongoose.connect(process.env.MONGO_URI)

async function seed() {
  const mathCourse = await Course.create({
    title: "Suites numériques",
    subject: "Mathématiques",
    level: "Bac Tunisien",
    chapter: "Suites",
    description: "Introduction aux suites numériques : définition, termes, récurrence.",
    content: `
      - Définition d'une suite
      - Suite arithmétique et géométrique
      - Formule du terme général
      - Exercices d'application
    `
  })

  const pythonCourse = await Course.create({
    title: "Suites en Python",
    subject: "Python",
    level: "Bac Tunisien",
    chapter: "Suites",
    description: "Manipulation des suites avec Python.",
    content: `
      Exemple : afficher les 10 premiers termes d'une suite arithmétique :
      \`\`\`python
      def suite_arithmetique(u0, r, n):
          return [u0 + k*r for k in range(n)]

      print(suite_arithmetique(2, 3, 10))
      \`\`\`
    `,
    linkedCourse: mathCourse._id
  })

  // Mise à jour du cours de maths pour pointer vers Python
  mathCourse.linkedCourse = pythonCourse._id
  await mathCourse.save()

  console.log("Cours insérés avec succès ✅")
  process.exit()
}

seed()
