import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import Course from '../models/courseModel.js'
import { isAuth, isAdmin } from '../utils.js'

const courseRouter = express.Router()

// Route pour insérer les cours initiaux (seeding)
courseRouter.post(
  '/seed',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    await Course.deleteMany({}) // ⚠️ optionnel : vider avant de recréer

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

    mathCourse.linkedCourse = pythonCourse._id
    await mathCourse.save()

    res.send({ message: 'Cours insérés avec succès ✅', courses: [mathCourse, pythonCourse] })
  })
)

// Route pour lister tous les cours
// courseRouter.get(
//   '/',
//   expressAsyncHandler(async (req, res) => {
//     const courses = await Course.find({})
//     res.send(courses)
//   })
// )
// courseRouter.post(
//   '/',
//   isAuth,
//   isAdmin,
//   expressAsyncHandler(async (req, res) => {
//     const { title, subject, level, chapter, description, content, linkedCourse } = req.body

//     const course = new Course({
//       title,
//       subject,
//       level,
//       chapter,
//       description,
//       content,
//       linkedCourse: linkedCourse || null,
//       formation,
//     })

//     const createdCourse = await course.save()
//     res.status(201).send({ message: 'Cours créé avec succès ✅', course: createdCourse })
//   })
// )

courseRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const {
      title,
      subject,
      level,
      chapter,
      description,
      content,
      linkedCourse,
      formation, // ✅ ajouter ici
    } = req.body

    // ✅ On inclut "formation" lors de la création
    const course = new Course({
      title,
      subject,
      level,
      chapter,
      description,
      content,
      formation, // 👈 ici aussi !
      linkedCourse: linkedCourse || null,
    })

    const createdCourse = await course.save()

    res
      .status(201)
      .send({ message: 'Cours créé avec succès ✅', course: createdCourse })
  })
)


courseRouter.get('/test', (req, res) => {
  res.send({ message: 'Course route OK ✅' })
})


courseRouter.get('/', async (req, res) => {
  try {
    const courses = await Course.find({})
    res.json(courses)
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' })
  }
})

// GET course by ID
courseRouter.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

courseRouter.get('/formation/:formation', async (req, res) => {
  try {
    const courses = await Course.find({ formation: req.params.formation });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default courseRouter
