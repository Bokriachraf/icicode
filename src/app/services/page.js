'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const services = [
  {
    title: 'Dédouanement',
    description:
      "Prise en charge complète des démarches douanières à l’import/export, incluant les déclarations officielles.",
    icon: '/hand.png',
  },
  {
    title: 'Transport',
    description:
      "Gestion complète du transport des biens depuis les frontières jusqu’au point de livraison final.",
    icon: '/logistics.png',
  },
  {
    title: 'Comptabilité',
    description:
      "Suivi comptable, déclarations financières, gestion des charges sociales comme la CNSS.",
    icon: '/accounting.png',
  },
  {
    title: 'Facturation',
    description:
      "Émission, vérification et suivi des factures liées aux opérations logistiques et douanières.",
    icon: '/invoice.jpg',
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen pt-24 pb-24 px-6 bg-gradient-to-br from-gray-50 to-gray-200 text-gray-800">
      <div className="max-w-6xl mx-auto space-y-12">
        <motion.h1
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center"
        >
          Nos Services
        </motion.h1>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {services.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out text-center flex flex-col items-center"
            >
              {/* Bloc icône uniforme */}
              <div className="w-20 h-20 flex items-center justify-center mb-4">
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={60}
                  height={60}
                  className="object-contain w-full h-full"
                />
              </div>

              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-sm">{item.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/contact"
            className="bg-yellow-500 text-black font-semibold py-3 px-6 rounded hover:bg-yellow-600 transition duration-300"
          >
            Nous contacter
          </Link>
        </div>
      </div>
    </div>
  );
}


// 'use client'

// import { motion } from 'framer-motion'
// import Image from 'next/image'
// import Link from 'next/link'

// const services = [
//   {
//     title: 'Dédouanement',
//     description:
//       "Prise en charge complète des démarches douanières à l’import/export, incluant les déclarations officielles.",
//     // icon: '/icons/declaration.svg',
//     icon: '/hand.png',
//   },
//   {
//     title: 'Transport',
//     description:
//       "Gestion complète du transport des biens depuis les frontières jusqu’au point de livraison final.",
//     icon: '/logistics.png',
//   },
//   {
//     title: 'Comptabilité',
//     description:
//       "Suivi comptable, déclarations financières, gestion des charges sociales comme la CNSS.",
//     icon: '/accounting.png',
//   },
//   {
//     title: 'Facturation',
//     description:
//       "Émission, vérification et suivi des factures liées aux opérations logistiques et douanières.",
//     icon: '/invoice.jpg',
//   },
// ]

// export default function ServicesPage() {
//   return (
//     <div className="min-h-screen pt-24 pb-24 px-6 bg-gradient-to-br from-gray-50 to-gray-200 text-gray-800">
//       <div className="max-w-6xl mx-auto space-y-12">
//         <motion.h1
//           initial={{ y: -30, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 0.6 }}
//           className="text-4xl font-bold text-center"
//         >
//           Nos Services
//         </motion.h1>

//         <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
//           {services.map((item, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: index * 0.2 }}
//               className="bg-white p-6 rounded-lg shadow-lg text-center"
//             >
//               <Image src={item.icon} alt={item.title} width={60} height={60} className="mx-auto mb-4" />
//               <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
//               <p className="text-sm">{item.description}</p>
//             </motion.div>
//           ))}
//         </div>

//         <div className="text-center mt-8">
//           <Link
//             href="/contact"
//             className="bg-yellow-500 text-black font-semibold py-3 px-6 rounded hover:bg-yellow-600 transition"
//           >
//             Nous contacter
//           </Link>
//         </div>
//       </div>
//     </div>
//   )
// }