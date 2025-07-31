'use client'

import ShipmentForm from '@/components/ShipmentForm'
import ShipmentList from '@/components/ShipmentList'

export default function ShipmentsPage() {
  return (
    <main className="p-6 max-w-5xl mx-auto space-y-8 pt-24">
      <h1 className="text-3xl font-bold text-center">📦 Gestion des Expéditions</h1>
      <ShipmentForm />
      <ShipmentList />
    </main>
  )
}