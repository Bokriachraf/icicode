'use client'

import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  setInscriptionData,
  submitInscription,
} from '../../redux/actions/inscriptionActions'
import { completeInscription } from '../../redux/actions/userActions'
import { listNiveaux } from '../../redux/actions/niveauActions'
import Loader from '../../components/Loader'

const CATEGORIES = [
  { key: 'college',    label: 'Collège',    flag: '🏫' },
  { key: 'lycee',      label: 'Lycée',      flag: '🎓' },
  { key: 'universite', label: 'Université', flag: '🏛️' },
]

const SYSTEMES = [
  { key: 'tunisien', label: 'Système Tunisien', flag: '🇹🇳' },
  { key: 'francais', label: 'Système Français', flag: '🇫🇷' },
]

export default function Step3({ onPrevious }) {
  const dispatch = useDispatch()
  const router = useRouter()

  const inscriptionData = useSelector((state) => state.inscription?.inscriptionData) || {}
  const { niveaux = [] } = useSelector((state) => state.niveauList || {})

  const [form, setForm] = useState({
    email: inscriptionData.email || '',
    nom: inscriptionData.nom || '',
    prenom: inscriptionData.prenom || '',
    tel: inscriptionData.tel || '',
    sourceDecouverte: inscriptionData.sourceDecouverte || '',
    newsletterConsent: inscriptionData.newsletterConsent || false,
  })

  const [categorie, setCategorie] = useState(null)
  const [systeme, setSysteme]     = useState(null)
  const [niveauId, setNiveauId]   = useState('')
  const [message, setMessage]     = useState(null)
  const [loading, setLoading]     = useState(false)

  useEffect(() => { dispatch(listNiveaux()) }, [dispatch])

  const niveauxFiltres = niveaux.filter(n => {
    if (!categorie) return false
    if (n.categorie !== categorie) return false
    if (categorie === 'universite') return true
    return n.systeme === systeme
  })

  const niveauChoisi = niveaux.find(n => n._id === niveauId)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const handleCategorie = (cat) => {
    setCategorie(cat)
    setSysteme(cat === 'universite' ? 'universite' : null)
    setNiveauId('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!niveauId) return setMessage('❌ Veuillez sélectionner votre niveau scolaire.')

    const finalData = { ...inscriptionData, ...form, niveauId }
    dispatch(setInscriptionData({ ...form, niveauId }))
    setLoading(true)
    setMessage(null)

    try {
      await dispatch(submitInscription(finalData))
      await dispatch(completeInscription())
      router.push('/inscription/suivi')
    } catch (err) {
      setMessage('❌ Une erreur est survenue lors de la soumission.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full bg-white border border-gray-300 rounded-lg px-3 py-3 text-base text-gray-900 focus:ring-2 focus:ring-green-500 focus:outline-none'

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-5 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold text-gray-800">Étape 3 : Informations personnelles</h2>

      {/* Prénom */}
      <div>
        <label className="block font-medium mb-1">Prénom *</label>
        <input type="text" name="prenom" value={form.prenom} onChange={handleChange} className={inputClass} required />
      </div>

      {/* Nom */}
      <div>
        <label className="block font-medium mb-1">Nom *</label>
        <input type="text" name="nom" value={form.nom} onChange={handleChange} className={inputClass} required />
      </div>

      {/* Email */}
      <div>
        <label className="block font-medium mb-1">Email *</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} className={inputClass} required />
      </div>

      {/* Téléphone */}
      <div>
        <label className="block font-medium mb-1">Téléphone (+216)</label>
        <input type="tel" name="tel" placeholder="+216 ..." value={form.tel} onChange={handleChange} className={inputClass} />
      </div>

      {/* ── Niveau scolaire en 3 étapes ── */}
      <div>
        <label className="block font-medium mb-2">Niveau scolaire *</label>

        {/* Étape 1 — Catégorie */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {CATEGORIES.map(cat => (
            <button key={cat.key} type="button" onClick={() => handleCategorie(cat.key)}
              className={`flex flex-col items-center gap-1 py-3 rounded-xl border-2 text-xs font-semibold transition
                ${categorie === cat.key
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300 bg-white'}`}
            >
              <span className="text-xl">{cat.flag}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Étape 2 — Système tunisien ou français */}
        {categorie && categorie !== 'universite' && (
          <div className="grid grid-cols-2 gap-2 mb-3">
            {SYSTEMES.map(sys => (
              <button key={sys.key} type="button"
                onClick={() => { setSysteme(sys.key); setNiveauId('') }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-medium transition
                  ${systeme === sys.key
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300 bg-white'}`}
              >
                <span className="text-lg">{sys.flag}</span>
                {sys.label}
              </button>
            ))}
          </div>
        )}

        {/* Étape 3 — Années ou filières */}
        {niveauxFiltres.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {niveauxFiltres.map(n => (
              <button key={n._id} type="button" onClick={() => setNiveauId(n._id)}
                className={`py-2.5 px-3 rounded-xl border-2 text-sm font-medium text-left transition
                  ${niveauId === n._id
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'}`}
              >
                {n.nom}
              </button>
            ))}
          </div>
        )}

        {/* Résumé niveau choisi */}
        {niveauChoisi && (
          <div className="mt-3 flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2 text-sm text-green-700">
            ✅ Niveau sélectionné : <strong>{niveauChoisi.nom}</strong>
          </div>
        )}
      </div>

      {/* Source découverte */}
      <div>
        <label className="block font-medium mb-2">Comment nous avez-vous connu ?</label>
        <div className="flex flex-wrap gap-4">
          {['Google', 'Facebook', 'Youtube', 'LinkedIn', 'Newsletter', 'Recommandation'].map(source => (
            <label key={source} className="flex items-center gap-2 text-base">
              <input type="radio" name="sourceDecouverte" value={source}
                checked={form.sourceDecouverte === source} onChange={handleChange} className="scale-125" />
              <span>{source}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <label className="flex items-center gap-3 text-base">
        <input type="checkbox" name="newsletterConsent" checked={form.newsletterConsent}
          onChange={handleChange} className="scale-125" />
        <span>Je souhaite recevoir la newsletter</span>
      </label>

      {/* Actions */}
      <div className="flex justify-between pt-4">
        <button type="button" onClick={onPrevious}
          className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-3 rounded-lg">
          Précédent
        </button>
        <button type="submit" disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium">
          {loading ? <Loader /> : 'Soumettre'}
        </button>
      </div>

      {message && <p className="text-sm text-red-600 pt-2">{message}</p>}
    </form>
  )
}
