'use client'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addShipment } from '../redux/actions/shipmentActions'

const ShipmentForm = () => {
  const [name, setName] = useState('')
  const dispatch = useDispatch()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim()) {
      dispatch(addShipment({ name }))
      setName('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        placeholder="Nom de l'envoi"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 mr-2"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2">
        Ajouter
      </button>
    </form>
  )
}

export default ShipmentForm
