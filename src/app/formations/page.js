'use client'

import Image from 'next/image'

const formations = [
  {
    titre: 'Développement Web Fullstack',
    description: 'Maîtrisez les technologies HTML, CSS, JavaScript, React, Node.js, MongoDB pour créer des applications web modernes.',
    image: '/web.jpeg',
    duree: '12 semaines',
    niveau: 'Intermédiaire',
    prix: 'Gratuit / sur demande',
  },
  {
    titre: 'Développement Mobile',
    description: 'Créez des applications mobiles Android & iOS avec Flutter ou React Native.',
    image: '/mobile.jpg',
    duree: '8 semaines',
    niveau: 'Débutant à intermédiaire',
    prix: 'Gratuit / sur demande',
  },
  {
    titre: 'Intelligence Artificielle & Machine Learning',
    description: 'Découvrez les bases de l’IA, entraînez vos premiers modèles avec Python et Scikit-learn.',
    image: '/ia.jpg',
    duree: '10 semaines',
    niveau: 'Avancé',
    prix: 'Gratuit / sur demande',
  },
  {
    titre: 'Data Science & Data Analysis',
    description: 'Manipulez des datasets, créez des dashboards et apprenez à raconter des histoires avec les données.',
    image: '/data.jpg',
    duree: '10 semaines',
    niveau: 'Intermédiaire',
    prix: 'Gratuit / sur demande',
  },
  {
    titre: 'Gaming & Game Development',
    description: 'Développez vos premiers jeux avec Unity ou Godot, apprenez la logique des moteurs 2D/3D.',
    image: '/gaming.jpeg',
    duree: '8 semaines',
    niveau: 'Tous niveaux',
    prix: 'Gratuit / sur demande',
  },
  {
    titre: 'Marketing Digital & Management',
    description: 'Apprenez à gérer une stratégie marketing digitale, le SEO, les réseaux sociaux et l’analyse des campagnes.',
    image: '/marketing.webp',
    duree: '6 semaines',
    niveau: 'Tous niveaux',
    prix: 'Gratuit / sur demande',
  },
]

export default function FormationsPage() {
  return (
    <div className="min-h-screen px-6 py-24 bg-gray-50">
      <h1 className="text-3xl md:text-5xl font-bold mb-12 text-center text-gray-800">
        Formations proposées par Icicode
      </h1>

      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {formations.map((formation, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="relative w-full h-48">
              <Image
                src={formation.image}
                alt={formation.titre}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-5">
              <h2 className="text-xl font-bold text-indigo-700 mb-2">{formation.titre}</h2>
              <p className="text-gray-600 text-sm mb-3">{formation.description}</p>
              <p className="text-sm text-gray-700">⏱ Durée : {formation.duree}</p>
              <p className="text-sm text-gray-700">📈 Niveau : {formation.niveau}</p>
              <p className="text-sm text-gray-700">💰 Prix : {formation.prix}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
