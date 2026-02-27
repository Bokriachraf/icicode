'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setInscriptionData } from '../../redux/actions/inscriptionActions'

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

  const selectClass =
    'w-full bg-white border border-gray-300 rounded-lg px-3 py-3 text-base text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-green-500'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Disponibilité */}
      <div>
        <label className="block font-medium mb-1">
          Disponibilité *
        </label>
        <select
          name="disponibilite"
          value={form.disponibilite}
          onChange={handleChange}
          className={selectClass}
        >
          <option value="" disabled>
            -- Sélectionnez --
          </option>
          <option value="Immédiate">Immédiate</option>
          <option value="Dans 1 semaine">Dans 1 semaine</option>
          <option value="Dans 2 semaines">Dans 2 semaines</option>
          <option value="Dans 1 mois">Dans 1 mois</option>
        </select>

        {error && (
          <p className="text-red-600 text-sm mt-1">{error}</p>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onBack}
          className="bg-gray-500 hover:bg-gray-600 transition text-white px-5 py-3 rounded-lg"
        >
          Retour
        </button>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 transition text-white px-6 py-3 rounded-lg font-medium"
        >
          Suivant
        </button>
      </div>
    </form>
  )
}




// 'use client'
// import { useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { setInscriptionData } from '../../redux/actions/inscriptionActions'

// export default function Step2({ onNext, onBack }) {
//   const dispatch = useDispatch()
//   const { inscriptionData } = useSelector(state => state.inscription)

//   const [form, setForm] = useState({
//     disponibilite: inscriptionData.disponibilite || '',
//   })

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target
//     if (type === 'checkbox') {
//       const list = [...form[name]]
//       if (checked) {
//         list.push(value)
//       } else {
//         const index = list.indexOf(value)
//         if (index > -1) list.splice(index, 1)
//       }
//       setForm({ ...form, [name]: list })
//     } else {
//       setForm({ ...form, [name]: value })
//     }
//   }

//   const handleCheckboxChange = (e, group) => {
//     const { name, checked } = e.target
//     const current = inscriptionData[group] || []
//     const updated = checked
//       ? [...current, name]
//       : current.filter((item) => item !== name)
//     dispatch(setInscriptionData({ [group]: updated }))
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     dispatch(setInscriptionData(form))
//     onNext()
//   }

//   const handleFileChange = (e) => {
//     dispatch(setInscriptionData({ fichiers: Array.from(e.target.files) }))
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div className="mb-4">
//         <label className="block mb-1">Disponibilité</label>
//         <select
//           name="disponibilite"
//           value={form.disponibilite || ''}
//           onChange={handleChange}
//           className="p-1 h-8 text-xs w-full p-2 border rounded"
//         >
//           <option value="">-- Sélectionnez --</option>
//           <option value="Immédiate">Immédiate</option>
//           <option value="Dans 1 semaine">Dans 1 semaine</option>
//           <option value="Dans 2 semaines">Dans 2 semaines</option>
//           <option value="Dans 1 mois">Dans 1 mois</option>
//         </select>
//       </div>

//       <div className="flex justify-between mt-6">
//         <button
//           type="button"
//           onClick={onBack}
//           className="bg-gray-500 text-white px-4 py-2 rounded"
//         >
//           Retour
//         </button>
//         <button
//           type="submit"
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           Suivant
//         </button>
//       </div>
//     </form>
//   )
// }
