import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import { isAuth, isAdmin } from '../utils.js'

const userAdminRouter = express.Router()

// GET /api/admin/users — liste tous les users
userAdminRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({})
      .populate('niveauId', 'nom categorie')
      .sort({ createdAt: -1 })
    res.json(users)
  })
)

// PUT /api/admin/users/:id/role — changer le rôle d'un user
userAdminRouter.put(
  '/:id/role',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' })

    const { role, isAdmin: adminFlag } = req.body

    if (role) user.role = role
    if (typeof adminFlag === 'boolean') user.isAdmin = adminFlag

    const updated = await user.save()
    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      isAdmin: updated.isAdmin,
    })
  })
)

// DELETE /api/admin/users/:id
userAdminRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' })
    await user.deleteOne()
    res.json({ message: 'Utilisateur supprimé' })
  })
)

export default userAdminRouter
