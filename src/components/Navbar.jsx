'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { signout } from '../redux/actions/userActions'
import { useRouter } from 'next/navigation'
import Loader from './Loader'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isSticky, setIsSticky] = useState(false)
  const [loadingLogout, setLoadingLogout] = useState(false)

  const dispatch = useDispatch()
  const router = useRouter()

  const userSignin = useSelector((state) => state.userSignin || {})
  const { userInfo } = userSignin

  const signoutHandler = () => {
    setLoadingLogout(true)
    dispatch(signout())
    setTimeout(() => {
      setLoadingLogout(false)
      setMenuOpen(false)
      router.push('/')
    }, 1000)
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`${isSticky ? 'shadow-xl bg-black/80 backdrop-blur-md' : 'bg-black/60'} text-white py-4 px-6 fixed top-0 left-0 right-0 z-20 transition-all duration-300 ease-in-out`}>
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo et utilisateur */}
        <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold">
         <Link href="/" className="hover:text-yellow-400">
  ICi <span className="text-orange-500">CODE</span></Link>
</h1>

          {userInfo && (
            <span className="text-sm md:hidden bg-green-700 text-white px-2 py-1 rounded">{userInfo.name}</span>
          )}
          {userInfo?.isAdmin && (
            <Link href="/admin" className="text-sm font-medium text-white hover:underline">🔐 Admin</Link>
          )}
        </div>

        {/* Hamburger (mobile) */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white focus:outline-none" aria-label="Ouvrir le menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Menu Desktop */}
        <ul className="hidden md:flex gap-6 items-center relative">
          <li><Link href="/" className="hover:text-yellow-400">Accueil</Link></li>
          <li><Link href="/formations" className="hover:text-yellow-400">Formations</Link></li>
          <li><Link href="/instructeurs" className="hover:text-yellow-400">Formateurs</Link></li>
          <li><Link href="/temoignages" className="hover:text-yellow-400">Témoignages</Link></li>
          <li><Link href="/about" className="hover:text-yellow-400">À propos</Link></li>
          <li><Link href="/contact" className="hover:text-yellow-400">Contact</Link></li>

          {userInfo && (
            <li>
              <Link href="/inscriptions/mine" className="bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-2 rounded-full font-semibold transition-all duration-300">
                📚 Mes Inscriptions
              </Link>
            </li>
          )}

          {userInfo ? (
            <li className="flex items-center gap-2">
              <span className="hover:text-yellow-400 cursor-default">{userInfo.name}</span>
              <button onClick={signoutHandler} className="text-sm text-red-500 hover:underline">
                {loadingLogout ? <Loader text="Déconnexion..." /> : 'Se déconnecter'}
              </button>
            </li>
          ) : (
            <li><Link href="/signin" className="hover:text-yellow-400">Se connecter</Link></li>
          )}
        </ul>
      </div>

      {/* Menu Mobile */}
      {menuOpen && (
        <div className="md:hidden mt-4 space-y-2">
          <Link href="/" onClick={() => setMenuOpen(false)} className="block hover:text-yellow-400">Accueil</Link>
          <Link href="/formations" onClick={() => setMenuOpen(false)} className="block hover:text-yellow-400">Formations</Link>
          <Link href="/instructeurs" onClick={() => setMenuOpen(false)} className="block hover:text-yellow-400">Formateurs</Link>
          <Link href="/temoignages" onClick={() => setMenuOpen(false)} className="block hover:text-yellow-400">Témoignages</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)} className="block hover:text-yellow-400">À propos</Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)} className="block hover:text-yellow-400">Contact</Link>

          {userInfo && (
            <Link href="/inscriptions/mine" onClick={() => setMenuOpen(false)} className="block hover:text-yellow-400">📚 Mes Inscriptions</Link>
          )}

          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="block bg-yellow-400 text-black px-4 py-2 rounded-full text-center font-semibold"
          >
            ✉️ Contact
          </Link>

          {userInfo ? (
            <button onClick={signoutHandler} className="block text-left text-red-500 hover:underline w-full">
              {loadingLogout ? 'Déconnexion...' : 'Se déconnecter'}
            </button>
          ) : (
            <Link href="/signin" onClick={() => setMenuOpen(false)} className="block hover:text-yellow-400">Se connecter</Link>
          )}
        </div>
      )}
    </nav>
  )
}

