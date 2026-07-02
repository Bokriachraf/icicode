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

  const { userInfo } = useSelector((state) => state.userSignin || {})
  const isAdmin = userInfo?.isAdmin

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
    const handleScroll = () => setIsSticky(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const linkClass = 'text-sm hover:text-yellow-400 transition-colors whitespace-nowrap'

  return (
    <nav className={`${isSticky ? 'shadow-xl bg-black/90 backdrop-blur-md' : 'bg-black/70'} text-white py-3 px-4 fixed top-0 left-0 right-0 z-20 transition-all duration-300`}>
      <div className="flex items-center justify-between max-w-7xl mx-auto gap-4">

        {/* Logo + liens gauche */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <Link href="/" className="text-base font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent whitespace-nowrap">
            Codalog
          </Link>

          {userInfo && isAdmin && (
            <Link href="/admin" className="text-sm font-semibold text-yellow-400 whitespace-nowrap">
              🔐 Admin
            </Link>
          )}

          {userInfo && !isAdmin && (
            <Link href="/dashboard" className="text-sm font-semibold text-blue-300 hover:text-blue-200 transition-colors whitespace-nowrap">
              Dashboard
            </Link>
          )}
        </div>

        {/* Menu Desktop */}
        <ul className="hidden md:flex items-center gap-4 flex-wrap justify-end">
          {!isAdmin && (
            <>
              <li><Link href="/" className={linkClass}>Accueil</Link></li>
              <li><Link href="/formations" className={linkClass}>Formations</Link></li>
              <li><Link href="/about" className={linkClass}>À propos</Link></li>
              <li><Link href="/contact" className={linkClass}>Contact</Link></li>

              {userInfo && (
                <>
                  <li>
                    <Link href="/inscription/suivi" className="text-sm bg-yellow-400 hover:bg-yellow-300 text-black px-3 py-1.5 rounded-full font-semibold transition whitespace-nowrap">
                      📚 Mes inscriptions
                    </Link>
                  </li>
                  <li>
                    <Link href="/inscription" className="text-sm bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-full font-semibold transition whitespace-nowrap">
                      + S'inscrire
                    </Link>
                  </li>
                </>
              )}
            </>
          )}

          {/* Connexion / Déconnexion */}
          {userInfo ? (
            <li className="flex items-center gap-2 flex-shrink-0">
              <span className="text-sm text-gray-300 max-w-[100px] truncate">{userInfo.name}</span>
              <button onClick={signoutHandler} className="text-xs text-red-400 hover:underline whitespace-nowrap">
                {loadingLogout ? <Loader text="..." /> : 'Déconnecter'}
              </button>
            </li>
          ) : (
            <li>
              <Link href="/signin" className="text-sm bg-white text-black px-3 py-1.5 rounded-full font-semibold hover:bg-gray-100 transition whitespace-nowrap">
                Se connecter
              </Link>
            </li>
          )}
        </ul>

        {/* Hamburger mobile */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white p-1" aria-label="Menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </div>

      {/* Menu Mobile */}
      {menuOpen && (
        <div className="md:hidden mt-3 border-t border-white/10 pt-3 flex flex-col gap-2 px-2">
          {!isAdmin && (
            <>
              <Link href="/" onClick={() => setMenuOpen(false)} className="text-sm hover:text-yellow-400">Accueil</Link>
              <Link href="/formations" onClick={() => setMenuOpen(false)} className="text-sm hover:text-yellow-400">Formations</Link>
              <Link href="/about" onClick={() => setMenuOpen(false)} className="text-sm hover:text-yellow-400">À propos</Link>
              <Link href="/contact" onClick={() => setMenuOpen(false)} className="text-sm hover:text-yellow-400">Contact</Link>

              {userInfo && (
                <>
                  <Link href="/inscription/suivi" onClick={() => setMenuOpen(false)} className="text-sm text-yellow-400 font-semibold">
                    📚 Mes inscriptions
                  </Link>
                  <Link href="/inscription" onClick={() => setMenuOpen(false)} className="text-sm text-green-400 font-semibold">
                    + S'inscrire à une formation
                  </Link>
                </>
              )}
            </>
          )}

          {isAdmin && (
            <Link href="/admin" onClick={() => setMenuOpen(false)} className="text-sm text-yellow-400 font-semibold">
              🔐 Dashboard Admin
            </Link>
          )}

          {userInfo ? (
            <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-1">
              <span className="text-sm text-gray-300">{userInfo.name}</span>
              <button onClick={signoutHandler} className="text-sm text-red-400 hover:underline">
                {loadingLogout ? 'Déconnexion...' : 'Se déconnecter'}
              </button>
            </div>
          ) : (
            <Link href="/signin" onClick={() => setMenuOpen(false)} className="text-sm text-white font-semibold">
              Se connecter
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}
