'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setInscriptionData } from '../../redux/actions/inscriptionActions';
import countries from '../../utils/countries';

export default function Step1({ onNext }) {
  const dispatch = useDispatch();
  const inscriptionData = useSelector((state) => state?.inscription?.inscriptionData) || {};

  const [form, setForm] = useState({
    formation: inscriptionData.formation || '',
    mode: inscriptionData.mode || '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    // Efface l'erreur si utilisateur remplit le champ
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!form.mode) newErrors.mode = 'Le mode est requis';
    if (!form.formation) newErrors.formation = 'La formation est requise';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      dispatch(setInscriptionData(form));
      onNext();
    }
  };

    const formation = [
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
       <div>
        <label className="block font-semibold mb-1">Formation *</label>
       <select
  name="formation"
  value={form.formation}
  onChange={handleChange}
  className="w-full border border-gray-300 rounded px-3 py-2"
  required
>
  <option value="">-- Choisir une formation --</option>
  {formation.map((f) => (
    <option key={f} value={f}>
      {f}
    </option>
  ))}
</select>
      </div>

      <div>
        <label className="block font-semibold mb-1">Mode de formation</label>
        <select
  name="mode"
  value={form.mode}
  onChange={handleChange}
  className="w-full border border-gray-300 rounded px-3 py-2"
>
  <option value="">-- Choisir un mode --</option>
  <option value="Présentiel">Présentiel</option>
  <option value="En ligne">En ligne</option>
</select>

      </div>
      {/* Bouton Suivant */}
      <div className="flex justify-end mt-6">
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Suivant
        </button>
      </div>
    </form>
  );
}