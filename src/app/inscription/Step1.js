'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setInscriptionData } from '../../redux/actions/inscriptionActions'

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

  const selectClass =
    'w-full bg-white border border-gray-300 rounded-lg px-3 py-3 text-base text-gray-900 focus:ring-2 focus:ring-green-500 focus:outline-none appearance-none'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Formation */}
      <div>
        <label className="block font-medium mb-1">Formation *</label>
        <select
          name="formation"
          value={form.formation}
          onChange={handleChange}
          className={selectClass}
        >
          <option value="" disabled>
            -- Choisir une formation --
          </option>
          {formationList.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
        {errors.formation && (
          <p className="text-red-600 text-sm mt-1">{errors.formation}</p>
        )}
      </div>

      {/* Mode */}
      <div>
        <label className="block font-medium mb-1">Mode de formation *</label>
        <select
          name="mode"
          value={form.mode}
          onChange={handleChange}
          className={selectClass}
        >
          <option value="" disabled>
            -- Choisir un mode --
          </option>
          <option value="Présentiel">Présentiel</option>
          <option value="En ligne">En ligne</option>
        </select>
        {errors.mode && (
          <p className="text-red-600 text-sm mt-1">{errors.mode}</p>
        )}
      </div>

      <div className="flex justify-end pt-4">
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




// 'use client';

// import { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { setInscriptionData } from '../../redux/actions/inscriptionActions';
// import countries from '../../utils/countries';

// export default function Step1({ onNext }) {
//   const dispatch = useDispatch();
//   const inscriptionData = useSelector((state) => state?.inscription?.inscriptionData) || {};

//   const [form, setForm] = useState({
//     formation: inscriptionData.formation || '',
//     mode: inscriptionData.mode || '',
//   });

//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });

//     // Efface l'erreur si utilisateur remplit le champ
//     if (errors[e.target.name]) {
//       setErrors({ ...errors, [e.target.name]: '' });
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const newErrors = {};
//     if (!form.mode) newErrors.mode = 'Le mode est requis';
//     if (!form.formation) newErrors.formation = 'La formation est requise';

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//     } else {
//       dispatch(setInscriptionData(form));
//       onNext();
//     }
//   };

//     const formation = [
//     'Développement Web',
//     'Développement Mobile',
//     'IA & Machine Learning',
//     'Data Science',
//     'Data Analysis',
//     'Mathématiques & Python',
//     'Gaming',
//     'Digital Marketing',
//     'Management',
//   ]

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//        <div>
//         <label className="block font-semibold mb-1">Formation *</label>
//        <select
//   name="formation"
//   value={form.formation}
//   onChange={handleChange}
//   className="w-full border border-gray-300 rounded px-3 py-2"
//   required
// >
//   <option value="">-- Choisir une formation --</option>
//   {formation.map((f) => (
//     <option key={f} value={f}>
//       {f}
//     </option>
//   ))}
// </select>
//       </div>

//       <div>
//         <label className="block font-semibold mb-1">Mode de formation</label>
//         <select
//   name="mode"
//   value={form.mode}
//   onChange={handleChange}
//   className="w-full border border-gray-300 rounded px-3 py-2"
// >
//   <option value="">-- Choisir un mode --</option>
//   <option value="Présentiel">Présentiel</option>
//   <option value="En ligne">En ligne</option>
// </select>

//       </div>
//       {/* Bouton Suivant */}
//       <div className="flex justify-end mt-6">
//         <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
//           Suivant
//         </button>
//       </div>
//     </form>
//   );
// }