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
    const handleScroll = () => setIsSticky(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isAdmin = userInfo?.isAdmin

  return (
    <nav
      className={`${
        isSticky ? 'shadow-xl bg-black/80 backdrop-blur-md' : 'bg-black/60'
      } text-white py-4 px-6 fixed top-0 left-0 right-0 z-20 transition-all duration-300 ease-in-out`}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">
            <Link
              href="/"
              className="bg-gradient-to-r from-white to-[#1E3A8A] bg-clip-text text-transparent hover:from-white hover:to-blue-400 transition-all duration-300"
            >
              Codalog
            </Link>
          </h1>
            {userInfo?.isAdmin && (
             <Link href="/admin" className="text-xl font-bold bg-gradient-to-r from-[#1E3A8A] to-white bg-clip-text text-transparent hover:from-white hover:to-blue-400 transition-all duration-300">🔐 Admin</Link>
          )}

           {userInfo && !isAdmin && (
             <Link href="/dashboard" className="text-xl font-bold bg-gradient-to-r from-[#1E3A8A] to-white bg-clip-text text-transparent hover:from-white hover:to-blue-400 transition-all duration-300"> Dashboard</Link>
          )} 

          {/* Nom utilisateur (mobile) */}
          {userInfo && !isAdmin && (
            <span className="text-sm md:hidden bg-green-700 text-white px-2 py-1 rounded">
              {userInfo.name}
            </span>
          )}
        </div>

        {/* Hamburger (mobile) */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white focus:outline-none"
            aria-label="Ouvrir le menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Menu Desktop */}
        <ul className="hidden md:flex gap-6 items-center relative">
          {/* Si ce n’est PAS un admin, afficher le menu public */}
          {!isAdmin && (
            <>
              <li><Link href="/" className="hover:text-yellow-400">Accueil</Link></li>
              <li><Link href="/formations" className="hover:text-yellow-400">Formations</Link></li>
              <li><Link href="/instructeurs" className="hover:text-yellow-400">Formateurs</Link></li>
              <li><Link href="/temoignages" className="hover:text-yellow-400">Témoignages</Link></li>
              <li><Link href="/about" className="hover:text-yellow-400">À propos</Link></li>
              <li><Link href="/contact" className="hover:text-yellow-400">Contact</Link></li>

              {userInfo && (
                <li>
                  <Link
  href="/inscriptions/mine"
  className="px-5 py-2 rounded-full font-semibold 
             bg-gradient-to-r from-[#1E3A8A] to-white 
             text-transparent bg-clip-text border-2 border-[#1E3A8A]
             hover:from-white hover:to-[#2563EB] hover:border-[#2563EB]
             transition-all duration-500"
>
  📚 Mes Inscriptions
</Link>

                  {/* <Link
                    href="/inscriptions/mine"
                    className="bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-2 rounded-full font-semibold transition-all duration-300"
                  >
                    📚 Mes Inscriptions
                  </Link> */}
                </li>
              )}
            </>
          )}

          {/* Si admin, afficher le lien admin */}
          {/* {isAdmin && (
            <li>
              <Link
                href="/admin"
                className="text-yellow-400 hover:text-yellow-300 font-semibold"
              >
                🛠️ Dashboard Admin
              </Link>
            </li>
          )} */}
         

          {/* Connexion / Déconnexion */}
          {userInfo ? (
            <li className="flex items-center gap-2">
              <span className="hover:text-yellow-400 cursor-default">
                {userInfo.name}
              </span>
              <button
                onClick={signoutHandler}
                className="text-sm text-red-500 hover:underline"
              >
                {loadingLogout ? <Loader text="Déconnexion..." /> : 'Se déconnecter'}
              </button>
            </li>
          ) : (
            <li>
              <Link href="/signin" className="hover:text-yellow-400">
                Se connecter
              </Link>
            </li>
          )}
        </ul>
      </div>

      {/* Menu Mobile */}
      {menuOpen && (
        <div className="md:hidden mt-4 space-y-2">
          {!isAdmin && (
            <>
              <Link href="/" onClick={() => setMenuOpen(false)} className="block hover:text-yellow-400">Accueil</Link>
              <Link href="/formations" onClick={() => setMenuOpen(false)} className="block hover:text-yellow-400">Formations</Link>
              <Link href="/instructeurs" onClick={() => setMenuOpen(false)} className="block hover:text-yellow-400">Formateurs</Link>
              <Link href="/temoignages" onClick={() => setMenuOpen(false)} className="block hover:text-yellow-400">Témoignages</Link>
              <Link href="/about" onClick={() => setMenuOpen(false)} className="block hover:text-yellow-400">À propos</Link>
              <Link href="/contact" onClick={() => setMenuOpen(false)} className="block hover:text-yellow-400">Contact</Link>

              {userInfo && (
                <Link
                  href="/inscriptions/mine"
                  onClick={() => setMenuOpen(false)}
                  className="block hover:text-yellow-400"
                >
                  📚 Mes Inscriptions
                </Link>
              )}
            </>
          )}

          {/* {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className="block text-yellow-400 font-semibold"
            >
              🛠️ Dashboard Admin
            </Link>
          )} */}

          {userInfo ? (
            <button
              onClick={signoutHandler}
              className="block text-left text-red-500 hover:underline w-full"
            >
              {loadingLogout ? 'Déconnexion...' : 'Se déconnecter'}
            </button>
          ) : (
            <Link href="/signin" onClick={() => setMenuOpen(false)} className="block hover:text-yellow-400">
              Se connecter
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}

// 'use client'

// import Link from 'next/link'
// import { useState, useEffect } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { signout } from '../redux/actions/userActions'
// import { useRouter } from 'next/navigation'
// import Loader from './Loader'

// export default function Navbar() {
//   const [menuOpen, setMenuOpen] = useState(false)
//   const [isSticky, setIsSticky] = useState(false)
//   const [loadingLogout, setLoadingLogout] = useState(false)

//   const dispatch = useDispatch()
//   const router = useRouter()

//   const userSignin = useSelector((state) => state.userSignin || {})
//   const { userInfo } = userSignin

//   const signoutHandler = () => {
//     setLoadingLogout(true)
//     dispatch(signout())
//     setTimeout(() => {
//       setLoadingLogout(false)
//       setMenuOpen(false)
//       router.push('/')
//     }, 1000)
//   }

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsSticky(window.scrollY > 10)
//     }
//     window.addEventListener('scroll', handleScroll)
//     return () => window.removeEventListener('scroll', handleScroll)
//   }, [])

//   return (
//     <nav className={`${isSticky ? 'shadow-xl bg-black/80 backdrop-blur-md' : 'bg-black/60'} text-white py-4 px-6 fixed top-0 left-0 right-0 z-20 transition-all duration-300 ease-in-out`}>
//       <div className="flex items-center justify-between max-w-7xl mx-auto">
//         {/* Logo et utilisateur */}
//         <div className="flex items-center gap-4">

// <h1 className="text-xl font-bold">
//   <Link 
//     href="/" 
//     className="bg-gradient-to-r from-white to-[#1E3A8A] bg-clip-text text-transparent hover:from-white hover:to-blue-400 transition-all duration-300"
//   >
//     Codalog
//   </Link>
// </h1>


//           {userInfo && (
//             <span className="text-sm md:hidden bg-green-700 text-white px-2 py-1 rounded">{userInfo.name}</span>
//           )}
//           {userInfo?.isAdmin && (
//             <Link href="/admin" className="text-xl font-bold bg-gradient-to-r from-[#1E3A8A] to-white bg-clip-text text-transparent hover:from-white hover:to-blue-400 transition-all duration-300">🔐 Admin</Link>
//           )}
//         </div>

//         {/* Hamburger (mobile) */}
//         <div className="md:hidden">
//           <button onClick={() => setMenuOpen(!menuOpen)} className="text-white focus:outline-none" aria-label="Ouvrir le menu">
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
//             </svg>
//           </button>
//         </div>

//         {/* Menu Desktop */}
//         <ul className="hidden md:flex gap-6 items-center relative">
//           <li><Link href="/" className="hover:text-yellow-400">Accueil</Link></li>
//           <li><Link href="/formations" className="hover:text-yellow-400">Formations</Link></li>
//           <li><Link href="/instructeurs" className="hover:text-yellow-400">Formateurs</Link></li>
//           <li><Link href="/temoignages" className="hover:text-yellow-400">Témoignages</Link></li>
//           <li><Link href="/about" className="hover:text-yellow-400">À propos</Link></li>
//           <li><Link href="/contact" className="hover:text-yellow-400">Contact</Link></li>

//           {userInfo && (
//             <li>
//               <Link href="/inscriptions/mine" className="bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-2 rounded-full font-semibold transition-all duration-300">
//                 📚 Mes Inscriptions
//               </Link>
//             </li>
//           )}

//           {userInfo ? (
//             <li className="flex items-center gap-2">
//               <span className="hover:text-yellow-400 cursor-default">{userInfo.name}</span>
//               <button onClick={signoutHandler} className="text-sm text-red-500 hover:underline">
//                 {loadingLogout ? <Loader text="Déconnexion..." /> : 'Se déconnecter'}
//               </button>
//             </li>
//           ) : (
//             <li><Link href="/signin" className="hover:text-yellow-400">Se connecter</Link></li>
//           )}
//         </ul>
//       </div>

//       {/* Menu Mobile */}
//       {menuOpen && (
//         <div className="md:hidden mt-4 space-y-2">
//           <Link href="/" onClick={() => setMenuOpen(false)} className="block hover:text-yellow-400">Accueil</Link>
//           <Link href="/formations" onClick={() => setMenuOpen(false)} className="block hover:text-yellow-400">Formations</Link>
//           <Link href="/instructeurs" onClick={() => setMenuOpen(false)} className="block hover:text-yellow-400">Formateurs</Link>
//           <Link href="/temoignages" onClick={() => setMenuOpen(false)} className="block hover:text-yellow-400">Témoignages</Link>
//           <Link href="/about" onClick={() => setMenuOpen(false)} className="block hover:text-yellow-400">À propos</Link>
//           <Link href="/contact" onClick={() => setMenuOpen(false)} className="block hover:text-yellow-400">Contact</Link>

//           {userInfo && (
//             <Link href="/inscriptions/mine" onClick={() => setMenuOpen(false)} className="block hover:text-yellow-400">📚 Mes Inscriptions</Link>
//           )}
           

//           <Link
//             href="/contact"
//             onClick={() => setMenuOpen(false)}
//             className="block bg-yellow-400 text-black px-4 py-2 rounded-full text-center font-semibold"
//           >
//             ✉️ Contact
//           </Link>

//           {userInfo ? (
//             <button onClick={signoutHandler} className="block text-left text-red-500 hover:underline w-full">
//               {loadingLogout ? 'Déconnexion...' : 'Se déconnecter'}
//             </button>
//           ) : (
//             <Link href="/signin" onClick={() => setMenuOpen(false)} className="block hover:text-yellow-400">Se connecter</Link>
//           )}
//         </div>
//       )}
//     </nav>
//   )
// }

