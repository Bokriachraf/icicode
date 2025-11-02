'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { TypeAnimation } from 'react-type-animation'

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
      {/* ----- FOND ANIMÉ ----- */}
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

      {/* ----- CONTENU PRINCIPAL ----- */}
      <main className="relative z-10 flex flex-col md:flex-row min-h-screen items-center justify-between p-6 md:p-10 gap-12 pt-24">
        {/* ---- Bloc gauche ---- */}
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
            Formez-vous aux technologies les plus demandées :
            <br />
            <TypeAnimation
              sequence={[
                'Développement Web 💻',
                2000,
                'Design UX/UI 🎨',
                2000,
                'Cloud & DevOps ☁️',
                2000,
              ]}
              wrapper="span"
              cursor={true}
              repeat={Infinity}
              className="text-indigo-300 font-semibold"
            />
            <br />
            Des programmes concrets, des formateurs expérimentés,
            et un accompagnement vers l’emploi ou le freelancing.
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

        {/* ---- Bloc droit ---- */}
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
            className="text-lg md:text-xl"
          >
            Apprentissage pratique, projets réels, compétences solides.
            <motion.span
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 2.6, delay: 1.8 } } }}
              className="block"
            >
              Suivi personnalisé par des experts du terrain.
            </motion.span>
            <motion.span
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 2.6, delay: 2.8 } } }}
              className="block"
            >
              Accès à des outils modernes et à jour du marché.
            </motion.span>
            <motion.span
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 2.6, delay: 3.8 } } }}
              className="block"
            >
              Préparation aux certifications et aux entretiens techniques.
            </motion.span>
          </motion.p>

          <Link href="/formations">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="mt-5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              Découvrir nos formations
            </motion.button>
          </Link>
        </motion.div>
      </main>

      {/* ----- BANDE D’AVANTAGES ----- */}
      <div className="overflow-hidden bg-indigo-600 py-3">
        <motion.div
          animate={{ x: ['100%', '-100%'] }}
          transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
          className="whitespace-nowrap text-white font-semibold text-lg"
        >
          🚀 Apprentissage pratique • 🎓 Certificats reconnus • 💼 Accompagnement emploi • 🧠 Coaching individuel
        </motion.div>
      </div>

      {/* ----- NOS ATOUTS ----- */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          {[
            { title: 'Projets concrets', text: 'Apprends en réalisant des applications MERN réelles.' },
            { title: 'Suivi personnalisé', text: 'Un mentor suit ton évolution chaque semaine.' },
            { title: 'Emploi & Freelance', text: 'Prépare-toi à intégrer une entreprise ou lancer ton activité.' },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="p-6 bg-gray-50 rounded-2xl shadow-lg"
            >
              <h3 className="text-xl font-semibold mb-2 text-indigo-700">{item.title}</h3>
              <p className="text-gray-700">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ----- FORMATIONS PHARES ----- */}
      {/* <section className="bg-indigo-50 py-20">
        <h2 className="text-center text-3xl font-bold mb-10 text-indigo-800">Nos formations phares</h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 px-6">
          {[
            { name: 'Développement MERN', img: '/web.jpeg' },
            { name: 'Mathématiques & Python', img: '/mathpy.png' },
            { name: 'Blockchain & Sécurité', img: '/blockchain.jpg' },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl"
            >
              <Image src={f.img} alt={f.name} width={400} height={250} className="w-full object-cover" />
              <div className="p-4 text-center">
                <h3 className="font-semibold text-lg">{f.name}</h3>
                <Link href="/formations" className="text-indigo-600 hover:underline text-sm">Découvrir</Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section> */}

      <section className="bg-indigo-50 py-20">
  <h2 className="text-center text-3xl font-bold mb-12 text-indigo-800">
    Nos formations phares
  </h2>

  <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-8 px-6">
    {[
      { name: 'Développement MERN', img: '/web.jpeg' },
      { name: 'Mathématiques & Python', img: '/mathpy.png' },
      { name: 'Blockchain & Sécurité', img: '/blockchain.jpg' },
    ].map((f, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: i * 0.2 }}
        whileHover={{ scale: 1.03 }}
        className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl flex flex-col transition-transform duration-300"
      >
        {/* Image en ratio fixe */}
        <div className="relative w-full aspect-[16/9] overflow-hidden">
          <Image
            src={f.img}
            alt={f.name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Contenu */}
        <div className="flex-1 p-5 text-center flex flex-col justify-between">
          <h3 className="font-semibold text-lg text-gray-800 mb-2">{f.name}</h3>
          <Link
            href="/formations"
            className="inline-block text-indigo-600 font-medium hover:text-indigo-800 text-sm mt-auto"
          >
            Découvrir →
          </Link>
        </div>
      </motion.div>
    ))}
  </div>
</section>


      {/* ----- TÉMOIGNAGES ----- */}
      <section className="bg-white py-16">
        <h2 className="text-center text-3xl font-bold mb-10 text-indigo-700">Ils ont réussi grâce à codalog</h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 px-6">
          {[
            { name: 'Sami', text: 'Grâce à codalog, j’ai décroché un poste de développeur React junior !' },
            { name: 'Ines', text: 'La formation m’a permis de devenir freelance en un an.' },
          ].map((t, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-50 p-6 rounded-xl shadow"
            >
              <p className="text-gray-700 italic">“{t.text}”</p>
              <p className="mt-3 font-semibold text-indigo-600">— {t.name}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ----- CALL TO ACTION FINAL ----- */}
      <section className="bg-indigo-700 text-white text-center py-20">
        <h2 className="text-3xl font-bold mb-4">Prêt à rejoindre l’avenir du numérique ?</h2>
        <p className="mb-6 text-lg">Inscris-toi dès maintenant et commence ta transformation professionnelle.</p>
        <Link href="/inscription">
          <button className="bg-white text-indigo-700 font-semibold px-8 py-3 rounded-full shadow-lg hover:scale-105 transition-transform">
            Commencer gratuitement
          </button>
        </Link>
      </section>
    </div>
  )
}



// 'use client'
// import Link from 'next/link'
// import { motion } from 'framer-motion'
// import Image from 'next/image'
// import { useState, useEffect } from 'react'

// const sliderImages = [
//   '/web1.webp',
//   '/web2.jpg',
//   '/web3.webp',
//   '/web4.jpg',
//   '/web5.jpg',
// ]

// export default function Home() {
//   const [current, setCurrent] = useState(0)

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrent((prev) => (prev + 1) % sliderImages.length)
//     }, 5000)
//     return () => clearInterval(interval)
//   }, [])

//   // Animations ligne par ligne
//   const lineVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: (i) => ({
//       opacity: 1,
//       y: 0,
//       transition: { delay: i * 0.4, duration: 0.6 },
//     }),
//   }

//   return (
//     <div className="relative min-h-screen overflow-hidden">
//       {/* Background Ken Burns */}
//       <div className="fixed inset-0 -z-10 overflow-hidden">
//         {sliderImages.map((img, index) => (
//           <motion.div
//             key={index}
//             initial={{ opacity: 0 }}
//             animate={{
//               opacity: index === current ? 1 : 0,
//               scale: index === current ? 1.1 : 1,
//             }}
//             transition={{ duration: 5, ease: 'easeInOut' }}
//             className="absolute inset-0"
//           >
//             <Image
//               src={img}
//               alt="Background slide"
//               fill
//               priority={index === current}
//               quality={100}
//               style={{
//                 objectFit: 'cover',
//                 objectPosition: 'center top',
//               }}
//               sizes="100vw"
//             />
//           </motion.div>
//         ))}
//         <div className="absolute inset-0 bg-black bg-opacity-50" />
//       </div>

//       {/* Contenu visible */}
//       <main className="relative z-10 flex flex-col md:flex-row min-h-screen items-center justify-between p-6 md:p-10 gap-12 pt-24">
//         {/* Bloc gauche */}
//         <motion.div
//           id="tableau"
//           initial={{ x: -80, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ duration: 1 }}
//           className="text-white text-center md:text-left max-w-xl"
//         >
//           <motion.h2
//             custom={0}
//             variants={lineVariants}
//             initial="hidden"
//             animate="visible"
//             className="text-3xl md:text-5xl font-bold mb-2 tracking-tight"
//           >
//             Icicode, votre tremplin vers les métiers du numérique
//           </motion.h2>

//           <motion.h1
//             custom={1}
//             variants={lineVariants}
//             initial="hidden"
//             animate="visible"
//             className="text-lg md:text-2xl font-medium mb-6 leading-relaxed"
//           >
//         Formez-vous aux technologies les plus demandées : développement web, design, cloud et plus encore. Des programmes concrets, des formateurs expérimentés, et un accompagnement vers l’emploi ou le freelancing.

//           </motion.h1>

//           <Link href="/inscription">
//           <motion.button
//   whileHover={{ scale: 1.03 }}
//   whileTap={{ scale: 0.97 }}
//   className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
// >
// Inscription gratuite
// </motion.button>
           
//           </Link>
//         </motion.div>

//         {/* Bloc droit */}
//         <motion.div
//           initial={{ y: 80, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 1, delay: 0.6 }}
//           className="pt-16 pb-24 text-white text-center md:text-left max-w-xl"
//         >
//           <motion.h2
//             custom={2}
//             variants={lineVariants}
//             initial="hidden"
//             animate="visible"
//             className="pt-7 text-3xl md:text-4xl font-bold mb-6"
//           >
//             Construisez votre avenir professionnel dès aujourd’hui
//           </motion.h2>
//           <motion.p
//             custom={3}
//             variants={lineVariants}
//             initial="hidden"
//             animate="visible"
//             className="  text-lg md:text-xl"
//           >
//               Apprentissage pratique, projets réels, compétences solides.  
//             <motion.span
//     custom={2}
//     variants={{
//       hidden: { opacity: 0, y: 20 },
//       visible: { opacity: 1, y: 0, transition: { duration: 2.6, delay: 1.8 } },
//     }}
//     className="block"
//   >
// Suivi personnalisé par des experts du terrain.<br />  
//   </motion.span>
//          <motion.span
//     custom={2}
//     variants={{
//       hidden: { opacity: 0, y: 20 },
//       visible: { opacity: 1, y: 0, transition: { duration: 2.6, delay: 2.8 } },
//     }}
//     className="block"
//   >
// Accès à des outils modernes et à jour du marché.<br />
//   </motion.span>
//             <motion.span
//     custom={2}
//     variants={{
//       hidden: { opacity: 0, y: 20 },
//       visible: { opacity: 1, y: 0, transition: { duration: 2.6, delay: 3.8 } },
//     }}
//     className="block"
//   >
// Préparation aux certifications et aux entretiens techniques.<br />
//     <motion.span
//     custom={2}
//     variants={{
//       hidden: { opacity: 0, y: 20 },
//       visible: { opacity: 1, y: 0, transition: { duration: 2.6, delay: 4.8 } },
//     }}
//     className="block"
//   >
//     Débouchés en entreprise, freelance ou startup.
//   </motion.span>
//   </motion.span>
//           </motion.p>

//           <Link href="/formations">
//           <motion.button
//   whileHover={{ scale: 1.03 }}
//   whileTap={{ scale: 0.97 }}
//   className="mt-5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
// >
//   Découvrir nos formations
// </motion.button>
     
//           </Link>
//         </motion.div>
//       </main>
//     </div>
//   )
// }




