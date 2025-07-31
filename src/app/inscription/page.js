'use client'

import { useState } from 'react'
import PrivateRoute from '../../components/PrivateRoute';
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'

export default function InscriptionPage() {
  const [step, setStep] = useState(1)

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <PrivateRoute>
      <div className="pt-11 pb-24 max-w-md mx-auto mt-6 bg-white rounded shadow text-xs space-y-4">
        <div className="flex justify-between mb-8">
          <div className={`flex-1 text-center pb-2 border-b-4 ${step === 1 ? 'border-green-600 font-bold' : 'border-gray-300'}`}>
            1. Départ et arrivée
          </div>
          <div className={`flex-1 text-center pb-2 border-b-4 ${step === 2 ? 'border-green-600 font-bold' : 'border-gray-300'}`}>
            2. Détails du projet
          </div>
          <div className={`flex-1 text-center pb-2 border-b-4 ${step === 3 ? 'border-green-600 font-bold' : 'border-gray-300'}`}>
            3. À propos de vous
          </div>
        </div>

        {step === 1 && <Step1 onNext={handleNext} />}
        {step === 2 && <Step2 onNext={handleNext} onBack={handleBack} />}
        {step === 3 && <Step3 onBack={handleBack} />}
      </div>
    </PrivateRoute>
  )
}