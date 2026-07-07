'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setInscriptionData } from '../../redux/actions/inscriptionActions'

const selectClass =
  'w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.14)] rounded-lg px-4 py-3 text-[15px] text-[var(--brand-white)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] focus:border-[var(--brand-cyan)] transition appearance-none'

const labelClass = 'block text-xs font-medium tracking-wide uppercase mb-2'

export default function Step1({ onNext }) {
  const dispatch = useDispatch()
  const saved = useSelector((state) => state?.inscription?.inscriptionData) || {}

  const [form, setForm] = useState({
    formation: saved.formation || '',
    mode: saved.mode || '',
  })

  const [errors, setErrors] = useState({})

  const formationList = [
    'Développement Web',
    'Développement Mobile',
    'IA & Machine Learning',
    'Data Science',
    'Data Analysis',
    'Mathématiques & Python',
    'Gaming',
    'Digital Marketing',
    'Management',
  ]

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const err = {}
    if (!form.formation) err.formation = 'Formation requise'
    if (!form.mode) err.mode = 'Mode requis'

    if (Object.keys(err).length) {
      setErrors(err)
      return
    }

    dispatch(setInscriptionData(form))
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Formation */}
      <div>
        <label className={labelClass} style={{ color: 'var(--text-secondary)' }}>Formation *</label>
        <select name="formation" value={form.formation} onChange={handleChange} className={selectClass}>
          <option value="" disabled>-- Choisir une formation --</option>
          {formationList.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
        {errors.formation && (
          <p className="text-sm mt-1.5" style={{ color: '#FF8A8A' }}>{errors.formation}</p>
        )}
      </div>

      {/* Mode */}
      <div>
        <label className={labelClass} style={{ color: 'var(--text-secondary)' }}>Mode de formation *</label>
        <select name="mode" value={form.mode} onChange={handleChange} className={selectClass}>
          <option value="" disabled>-- Choisir un mode --</option>
          <option value="Présentiel">Présentiel</option>
          <option value="En ligne">En ligne</option>
        </select>
        {errors.mode && (
          <p className="text-sm mt-1.5" style={{ color: '#FF8A8A' }}>{errors.mode}</p>
        )}
      </div>

      <div className="flex justify-end pt-4">
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
