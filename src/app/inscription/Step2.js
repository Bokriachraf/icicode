'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setInscriptionData } from '../../redux/actions/inscriptionActions'

const selectClass =
  'w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.14)] rounded-lg px-4 py-3 text-[15px] text-[var(--brand-white)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] focus:border-[var(--brand-cyan)] transition appearance-none'

const labelClass = 'block text-xs font-medium tracking-wide uppercase mb-2'

export default function Step2({ onNext, onBack }) {
  const dispatch = useDispatch()
  const saved = useSelector((state) => state.inscription?.inscriptionData) || {}

  const [form, setForm] = useState({
    disponibilite: saved.disponibilite || '',
  })

  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.disponibilite) {
      setError('Veuillez sélectionner votre disponibilité')
      return
    }

    dispatch(setInscriptionData(form))
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Disponibilité */}
      <div>
        <label className={labelClass} style={{ color: 'var(--text-secondary)' }}>Disponibilité *</label>
        <select name="disponibilite" value={form.disponibilite} onChange={handleChange} className={selectClass}>
          <option value="" disabled>-- Sélectionnez --</option>
          <option value="Immédiate">Immédiate</option>
          <option value="Dans 1 semaine">Dans 1 semaine</option>
          <option value="Dans 2 semaines">Dans 2 semaines</option>
          <option value="Dans 1 mois">Dans 1 mois</option>
        </select>

        {error && (
          <p className="text-sm mt-1.5" style={{ color: '#FF8A8A' }}>{error}</p>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-3 rounded-lg transition text-sm font-medium"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)', color: 'var(--text-secondary)' }}
        >
          ← Retour
        </button>

        <button
          type="submit"
          className="font-semibold px-6 py-3 rounded-lg transition text-sm"
          style={{ background: 'linear-gradient(90deg, #FFD700, #FF8C00)', color: '#1a1400' }}
        >
          Suivant →
        </button>
      </div>
    </form>
  )
}
