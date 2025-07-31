'use client'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setInscriptionData } from '../../redux/actions/inscriptionActions'

export default function Step2({ onNext, onBack }) {
  const dispatch = useDispatch()
  const { inscriptionData } = useSelector(state => state.inscription)

  const [form, setForm] = useState({
    disponibilite: inscriptionData.disponibilite || '',
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (type === 'checkbox') {
      const list = [...form[name]]
      if (checked) {
        list.push(value)
      } else {
        const index = list.indexOf(value)
        if (index > -1) list.splice(index, 1)
      }
      setForm({ ...form, [name]: list })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const handleCheckboxChange = (e, group) => {
    const { name, checked } = e.target
    const current = inscriptionData[group] || []
    const updated = checked
      ? [...current, name]
      : current.filter((item) => item !== name)
    dispatch(setInscriptionData({ [group]: updated }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(setInscriptionData(form))
    onNext()
  }

  const handleFileChange = (e) => {
    dispatch(setInscriptionData({ fichiers: Array.from(e.target.files) }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-4">
        <label className="block mb-1">Disponibilité</label>
        <select
          name="disponibilite"
          value={form.disponibilite || ''}
          onChange={handleChange}
          className="p-1 h-8 text-xs w-full p-2 border rounded"
        >
          <option value="">-- Sélectionnez --</option>
          <option value="Immédiate">Immédiate</option>
          <option value="Dans 1 semaine">Dans 1 semaine</option>
          <option value="Dans 2 semaines">Dans 2 semaines</option>
          <option value="Dans 1 mois">Dans 1 mois</option>
        </select>
      </div>

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={onBack}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Retour
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Suivant
        </button>
      </div>
    </form>
  )
}
