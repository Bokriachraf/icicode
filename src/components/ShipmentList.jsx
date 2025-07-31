'use client'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { listShipments } from '../redux/actions/shipmentActions'

const ShipmentList = () => {
  const dispatch = useDispatch()

  // ✅ ici on récupère les données du reducer "shipmentList"
  const { shipments = [], loading = false, error = null  } = useSelector(state => state.shipmentList || {})

  useEffect(() => {
    dispatch(listShipments()) // ✅ ici on déclenche l'action
  }, [dispatch])

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Liste des expéditions</h2>
      {loading ? <p>Chargement...</p> :
        error ? <p className="text-red-500">{error}</p> :
        <ul className="list-disc pl-5">
          {shipments.map(s => (
            <li key={s._id}>{s.name} - {s.status}</li>
          ))}
        </ul>
      }
    </div>
  )
}

export default ShipmentList