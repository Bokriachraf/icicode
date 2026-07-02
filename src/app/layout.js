import '../styles/globals.css'
import Providers from './Providers'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HexBackground from '@/components/HexBackground'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const metadata = {
  title: {
    default: 'CODALOG',
    template: '%s | CODALOG',
  },
  description: 'Centre de formation en mathématiques, programmation et développement.',
  other: {
    'google-site-verification': 'Bj242K2ybb67aL2y-SBsxH6f0yMNX5VRMl0NGaglJyE',
  },
  keywords: 'CODALOG, mathématiques, programmation, développement web, formation, Tunis',
  robots: 'index, follow',
  authors: [{ name: 'Codalog' }],
  openGraph: {
    title: 'CODALOG - Programmation & Mathématiques',
    siteName: 'CODALOG',
    description: 'Centre de formation en programmation, mathématiques et développement.',
    type: 'website',
    locale: 'fr_FR',
    url: 'https://codalog.vercel.app/',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      {/*
        Structure :
          z-0  : HexBackground (fixed, couvre toute la fenêtre)
          z-10 : Navbar (fixed, au-dessus du fond)
          z-10 : contenu des pages (min-h-screen, scrollable)
          z-10 : Footer (flux normal, en bas du contenu)
          z-50 : ToastContainer (toujours au-dessus)
      */}
      <body style={{ position: 'relative' }}>
        <Providers>
          {/* Fond hexagonal global — une seule fois pour toutes les pages */}
          <HexBackground />

          {/* Wrapper principal au-dessus du fond */}
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />

            {/* pb-16 : espace pour le footer en flux normal */}
            <main style={{ flex: 1, paddingBottom: '4rem' }}>
              {children}
            </main>

            <Footer />
          </div>

          <ToastContainer
            position="top-center"
            autoClose={10000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </Providers>
      </body>
    </html>
  )
}
