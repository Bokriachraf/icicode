'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState, useEffect } from 'react'

const sliderImages = [
  '/web1.webp',
  '/web2.jpg',
  '/web3.webp',
  '/web4.jpg',
  '/web5.jpg',
]

export default function Home() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sliderImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Animations ligne par ligne
  const lineVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.4, duration: 0.6 },
    }),
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Ken Burns */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {sliderImages.map((img, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{
              opacity: index === current ? 1 : 0,
              scale: index === current ? 1.1 : 1,
            }}
            transition={{ duration: 5, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <Image
              src={img}
              alt="Background slide"
              fill
              priority={index === current}
              quality={100}
              style={{
                objectFit: 'cover',
                objectPosition: 'center top',
              }}
              sizes="100vw"
            />
          </motion.div>
        ))}
        <div className="absolute inset-0 bg-black bg-opacity-50" />
      </div>

      {/* Contenu visible */}
      <main className="relative z-10 flex flex-col md:flex-row min-h-screen items-center justify-between p-6 md:p-10 gap-12 pt-24">
        {/* Bloc gauche */}
        <motion.div
          id="tableau"
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-white text-center md:text-left max-w-xl"
        >
          <motion.h2
            custom={0}
            variants={lineVariants}
            initial="hidden"
            animate="visible"
            className="text-3xl md:text-5xl font-bold mb-2 tracking-tight"
          >
            Icicode, votre tremplin vers les métiers du numérique
          </motion.h2>

          <motion.h1
            custom={1}
            variants={lineVariants}
            initial="hidden"
            animate="visible"
            className="text-lg md:text-2xl font-medium mb-6 leading-relaxed"
          >
        Formez-vous aux technologies les plus demandées : développement web, design, cloud et plus encore. Des programmes concrets, des formateurs expérimentés, et un accompagnement vers l’emploi ou le freelancing.

          </motion.h1>

          <Link href="/inscription">
          <motion.button
  whileHover={{ scale: 1.03 }}
  whileTap={{ scale: 0.97 }}
  className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
>
Inscription gratuite
</motion.button>
           
          </Link>
        </motion.div>

        {/* Bloc droit */}
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="pt-16 pb-24 text-white text-center md:text-left max-w-xl"
        >
          <motion.h2
            custom={2}
            variants={lineVariants}
            initial="hidden"
            animate="visible"
            className="pt-7 text-3xl md:text-4xl font-bold mb-6"
          >
            Construisez votre avenir professionnel dès aujourd’hui
          </motion.h2>
          <motion.p
            custom={3}
            variants={lineVariants}
            initial="hidden"
            animate="visible"
            className="  text-lg md:text-xl"
          >
              Apprentissage pratique, projets réels, compétences solides.  
            <motion.span
    custom={2}
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 2.6, delay: 1.8 } },
    }}
    className="block"
  >
Suivi personnalisé par des experts du terrain.<br />  
  </motion.span>
         <motion.span
    custom={2}
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 2.6, delay: 2.8 } },
    }}
    className="block"
  >
Accès à des outils modernes et à jour du marché.<br />
  </motion.span>
            <motion.span
    custom={2}
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 2.6, delay: 3.8 } },
    }}
    className="block"
  >
Préparation aux certifications et aux entretiens techniques.<br />
    <motion.span
    custom={2}
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 2.6, delay: 4.8 } },
    }}
    className="block"
  >
    Débouchés en entreprise, freelance ou startup.
  </motion.span>
  </motion.span>
          </motion.p>

          <Link href="/formations">
          <motion.button
  whileHover={{ scale: 1.03 }}
  whileTap={{ scale: 0.97 }}
  className="mt-5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
>
  Découvrir nos formation
</motion.button>
     
          </Link>
        </motion.div>
      </main>
    </div>
  )
}




