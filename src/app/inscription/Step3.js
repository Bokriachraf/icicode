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

const inputClass =
  'w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.14)] rounded-lg px-4 py-3 text-[15px] text-[var(--brand-white)] placeholder-[rgba(168,200,230,0.35)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] focus:border-[var(--brand-cyan)] transition'

const labelClass = 'block text-xs font-medium tracking-wide uppercase mb-2'

const selBtn = (active) => ({
  background: active ? 'rgba(0,255,209,0.1)' : 'rgba(255,255,255,0.04)',
  borderColor: active ? 'var(--brand-cyan)' : 'rgba(255,255,255,0.14)',
  color: active ? 'var(--brand-cyan)' : 'var(--text-secondary)',
})

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
      await dispatch(completeInscription({
        nom:               form.nom,
        prenom:            form.prenom,
        email:             form.email,
        tel:               form.tel,
        niveauId:          niveauId,
        sourceDecouverte:  form.sourceDecouverte,
        newsletterConsent: form.newsletterConsent,
      }))
      router.push('/inscription/suivi')
    } catch (err) {
      setMessage('❌ Une erreur est survenue lors de la soumission.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-base font-semibold" style={{ color: 'var(--brand-white)' }}>
        Informations personnelles
      </h2>

      {/* Prénom */}
      <div>
        <label className={labelClass} style={{ color: 'var(--text-secondary)' }}>Prénom *</label>
        <input type="text" name="prenom" value={form.prenom} onChange={handleChange} className={inputClass} required />
      </div>

      {/* Nom */}
      <div>
        <label className={labelClass} style={{ color: 'var(--text-secondary)' }}>Nom *</label>
        <input type="text" name="nom" value={form.nom} onChange={handleChange} className={inputClass} required />
      </div>

      {/* Email */}
      <div>
        <label className={labelClass} style={{ color: 'var(--text-secondary)' }}>Email *</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} className={inputClass} required />
      </div>

      {/* Téléphone */}
      <div>
        <label className={labelClass} style={{ color: 'var(--text-secondary)' }}>Téléphone (+216)</label>
        <input type="tel" name="tel" placeholder="+216 ..." value={form.tel} onChange={handleChange} className={inputClass} />
      </div>

      {/* ── Niveau scolaire en 3 étapes ── */}
      <div>
        <label className={labelClass} style={{ color: 'var(--text-secondary)' }}>Niveau scolaire *</label>

        {/* Étape 1 — Catégorie */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {CATEGORIES.map(cat => (
            <button key={cat.key} type="button" onClick={() => handleCategorie(cat.key)}
              className="flex flex-col items-center gap-1 py-3 rounded-xl border-2 text-xs font-semibold transition"
              style={selBtn(categorie === cat.key)}
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
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-medium transition"
                style={selBtn(systeme === sys.key)}
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
                className="py-2.5 px-3 rounded-xl border-2 text-sm font-medium text-left transition"
                style={selBtn(niveauId === n._id)}
              >
                {n.nom}
              </button>
            ))}
          </div>
        )}

        {/* Résumé niveau choisi */}
        {niveauChoisi && (
          <div className="mt-3 flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm border" style={{ background: 'rgba(0,255,209,0.08)', borderColor: 'rgba(0,255,209,0.3)', color: 'var(--brand-cyan)' }}>
            ✅ Niveau sélectionné : <strong>{niveauChoisi.nom}</strong>
          </div>
        )}
      </div>

      {/* Source découverte */}
      <div>
        <label className={labelClass} style={{ color: 'var(--text-secondary)' }}>Comment nous avez-vous connu ?</label>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {['Google', 'Facebook', 'Youtube', 'LinkedIn', 'Newsletter', 'Recommandation'].map(source => (
            <label key={source} className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
              <input type="radio" name="sourceDecouverte" value={source}
                checked={form.sourceDecouverte === source} onChange={handleChange}
                style={{ accentColor: 'var(--brand-cyan)' }} className="w-4 h-4" />
              <span>{source}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <label className="flex items-center gap-3 text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
        <input type="checkbox" name="newsletterConsent" checked={form.newsletterConsent}
          onChange={handleChange} style={{ accentColor: 'var(--brand-cyan)' }} className="w-4 h-4" />
        <span>Je souhaite recevoir la newsletter</span>
      </label>

      {/* Actions */}
      <div className="flex justify-between pt-4">
        <button type="button" onClick={onPrevious}
          className="px-5 py-3 rounded-lg transition text-sm font-medium"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)', color: 'var(--text-secondary)' }}>
          ← Précédent
        </button>
        <button type="submit" disabled={loading}
          className="font-semibold px-6 py-3 rounded-lg transition text-sm disabled:opacity-60"
          style={{ background: 'linear-gradient(90deg, #FFD700, #FF8C00)', color: '#1a1400' }}>
          {loading ? <Loader /> : 'Soumettre →'}
        </button>
      </div>

      {message && <p className="text-sm pt-1" style={{ color: '#FF8A8A' }}>{message}</p>}
    </form>
  )
}
