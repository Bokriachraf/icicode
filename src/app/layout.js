import '../styles/globals.css'
import Providers from './Providers'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

// ✅ Importer react-toastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const metadata = {
  title: {
    default: 'CODALOG',
    template: '%s | CODALOG',
  },
  description: 'Centre de formation',
  other: {
    "google-site-verification": "Bj242K2ybb67aL2y-SBsxH6f0yMNX5VRMl0NGaglJyE",
  },
  keywords: 'CODALOG, blockchain, suivi, expédition, conformité',
  robots: 'index, follow',
  authors: [{ name: 'Votre Nom ou Entreprise' }],
  openGraph: {
    title: 'CODALOG - Suivi Douanier Digital',
    siteName: 'CODALOG',
    description: 'Centre de formation',
    type: 'website',
    locale: 'fr_FR',
    url: 'https://codalog.vercel.app/',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          {/* ✅ Ajouter le conteneur pour les toasts */}
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