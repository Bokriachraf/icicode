'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import PrivateRoute from '../../components/PrivateRoute'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'

const STEPS = ['Formation', 'Disponibilité', 'À propos de vous']

export default function InscriptionPage() {
  const [step, setStep] = useState(1)

  return (
    <PrivateRoute>
      <div className="min-h-screen flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="brand-card w-full max-w-lg p-6 sm:p-10"
        >
          <h1 className="text-xl font-bold text-center mb-1" style={{ color: 'var(--brand-white)' }}>
            Rejoindre Codalog
          </h1>
          <p className="text-center text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
            Quelques informations pour personnaliser votre parcours
          </p>

          {/* Progress */}
          <div className="flex justify-between mb-8 gap-2">
            {STEPS.map((label, index) => {
              const num = index + 1
              const current = num === step
              const done = num < step
              return (
                <div key={label} className="flex-1 text-center">
                  <div
                    className="mx-auto mb-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition"
                    style={{
                      background: done || current ? 'linear-gradient(135deg, #00FFD1, #00AAFF)' : 'rgba(255,255,255,0.06)',
                      color: done || current ? '#001830' : 'var(--text-muted)',
                      border: done || current ? 'none' : '1px solid rgba(255,255,255,0.14)',
                    }}
                  >
                    {done ? '✓' : num}
                  </div>
                  <div
                    className="text-[0.65rem] uppercase tracking-wide font-medium"
                    style={{ color: current ? 'var(--brand-cyan)' : 'var(--text-muted)' }}
                  >
                    {label}
                  </div>
                </div>
              )
            })}
          </div>

          {step === 1 && <Step1 onNext={() => setStep(2)} />}
          {step === 2 && <Step2 onNext={() => setStep(3)} onBack={() => setStep(1)} />}
          {step === 3 && <Step3 onPrevious={() => setStep(2)} />}
        </motion.div>
      </div>
    </PrivateRoute>
  )
}
