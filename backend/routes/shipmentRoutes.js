// ✅ routes/shipmentRoutes.js
import express from 'express'
import { getShipments, addShipment } from '../controllers/shipmentController.js'

const router = express.Router()

router.route('/')
  .get(getShipments)
  .post(addShipment)

export default router
