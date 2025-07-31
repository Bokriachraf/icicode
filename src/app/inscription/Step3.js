'use client'

import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { setInscriptionData, submitInscription } from '../../redux/actions/inscriptionActions'

export default function Step3({ onPrevious }) {
  const dispatch = useDispatch()
  const router = useRouter()

  const inscriptionData = useSelector((state) => state.inscription.inscriptionData) || {}

  const [form, setForm] = useState({
    email: inscriptionData.email || '',
    nom: inscriptionData.nom || '',
    prenom: inscriptionData.prenom || '',
    adresse: inscriptionData.adresse || '',
    tel: inscriptionData.tel || '',
    niveauEtude: inscriptionData.niveauEtude || '',
    sourceDecouverte: inscriptionData.sourceDecouverte || '',
    newsletterConsent: inscriptionData.newsletterConsent || false,
  })

  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const val = type === 'checkbox' ? checked : value
    setForm({ ...form, [name]: val })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const finalData = {
      ...inscriptionData,
      ...form,
    }

    dispatch(setInscriptionData(form)) // mise à jour finale dans Redux
    setLoading(true)

    try {
      console.log('Données envoyées :', finalData)
      await dispatch(submitInscription(finalData))
      setMessage('✅ Inscription soumise avec succès.')
      router.push('/inscription/suivi')
    } catch (err) {
      setMessage('❌ Une erreur est survenue lors de la soumission.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <h2 className="text-lg font-bold">Étape 3 : Compléments</h2>

      <div>
        <label className="text-xs block mb-1 font-medium">Prénom</label>
        <input
          type="text"
          name="prenom"
          value={form.prenom}
          onChange={handleChange}
          className="p-1 h-7 text-xs w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="text-xs block mb-1 font-medium">Nom</label>
        <input
          type="text"
          name="nom"
          value={form.nom}
          onChange={handleChange}
          className="p-1 h-7 text-xs w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="text-xs block mb-1 font-medium">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="p-1 h-7 text-xs w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="text-xs block mb-1 font-medium">Adresse</label>
        <input
          type="text"
          name="adresse"
          value={form.adresse}
          onChange={handleChange}
          className="p-1 h-7 text-xs w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="text-xs block mb-1 font-medium">Téléphone (+216)</label>
        <input
          type="tel"
          name="tel"
          placeholder="+216 ..."
          value={form.tel}
          onChange={handleChange}
          className="p-1 h-7 text-xs w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="text-xs block mb-1 font-medium">Niveau d'étude</label>
        <select
          name="niveauEtude"
          value={form.niveauEtude}
          onChange={handleChange}
          className="p-1 h-7 text-xs w-full p-2 border rounded"
        >
          <option value="">-- Sélectionnez --</option>
          <option value="Secondaire">Secondaire</option>
          <option value="Bac">Bac</option>
          <option value="Licence">Licence</option>
          <option value="Mastere">Mastere</option>
          <option value="Ingénieur">Ingénieur</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Comment nous avez-vous connu ?</label>
        <div className="flex gap-4 flex-wrap">
          {['Google', 'Facebook', 'Youtube', 'LinkedIn', 'Newsletter', 'Recommandation'].map(
            (source) => (
              <label key={source} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="sourceDecouverte"
                  value={source}
                  checked={form.sourceDecouverte === source}
                  onChange={handleChange}
                />
                <span>{source}</span>
              </label>
            )
          )}
        </div>
      </div>

      <div className="mb-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="newsletterConsent"
            checked={form.newsletterConsent}
            onChange={handleChange}
          />
          <span>Je souhaite recevoir la newsletter</span>
        </label>
      </div>

      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={onPrevious}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Précédent
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? 'Envoi...' : 'Soumettre'}
        </button>
      </div>

      {message && <p className="mt-4 text-sm">{message}</p>}
    </form>
  )
}
