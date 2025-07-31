import mongoose from 'mongoose'

const shipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, default: 'En attente' },
}, { timestamps: true })

 const Shipment = mongoose.model('Shipment', shipmentSchema)
 export default Shipment ;