"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { register } from "../../redux/actions/userActions";

const inputClass =
  "w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.14)] rounded-lg px-4 py-3 text-[15px] text-[var(--brand-white)] placeholder-[rgba(168,200,230,0.35)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] focus:border-[var(--brand-cyan)] transition";

const labelClass = "block text-xs font-medium tracking-wide uppercase mb-2";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mismatch, setMismatch] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.userRegister || {});

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMismatch(true);
      return;
    }
    setMismatch(false);
    dispatch(register(name, email, password, router));
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="brand-card w-full max-w-md p-8 sm:p-10"
      >
        <div className="flex items-center justify-center gap-[2px] mb-1">
          {[
            { c: 'C', b: false }, { c: 'O', b: true }, { c: 'D', b: false },
            { c: '@', b: true }, { c: 'L', b: false }, { c: 'O', b: true }, { c: 'G', b: false },
          ].map(({ c, b }, i) => (
            <span key={i} className="font-extrabold text-2xl"
              style={{ color: b ? '#00AAFF' : 'var(--brand-white)', fontFamily: "'JetBrains Mono', monospace" }}>
              {c}
            </span>
          ))}
        </div>

        <h1 className="text-xl font-bold text-center mt-3 mb-1" style={{ color: 'var(--brand-white)' }}>
          Créer un compte
        </h1>
        <p className="text-center text-sm mb-7" style={{ color: 'var(--text-secondary)' }}>
          Rejoignez Codalog et commencez à apprendre
        </p>

        {loading && (
          <div className="px-4 py-2.5 rounded-lg mb-4 text-sm border" style={{ background: 'rgba(74,144,226,0.1)', borderColor: 'rgba(74,144,226,0.3)', color: '#7BBAFF' }}>
            Création en cours...
          </div>
        )}
        {mismatch && (
          <div className="px-4 py-2.5 rounded-lg mb-4 text-sm border" style={{ background: 'rgba(255,80,80,0.08)', borderColor: 'rgba(255,80,80,0.3)', color: '#FF8A8A' }}>
            Les mots de passe ne correspondent pas.
          </div>
        )}
        {error && (
          <div className="px-4 py-2.5 rounded-lg mb-4 text-sm border" style={{ background: 'rgba(255,80,80,0.08)', borderColor: 'rgba(255,80,80,0.3)', color: '#FF8A8A' }}>
            {error}
          </div>
        )}

        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label className={labelClass} style={{ color: 'var(--text-secondary)' }}>Nom complet</label>
            <input type="text" required placeholder="Votre nom" value={name}
              onChange={(e) => setName(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className={labelClass} style={{ color: 'var(--text-secondary)' }}>Adresse e-mail</label>
            <input type="email" required placeholder="votre@email.com" value={email}
              onChange={(e) => setEmail(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className={labelClass} style={{ color: 'var(--text-secondary)' }}>Mot de passe</label>
            <input type="password" required placeholder="••••••••" value={password}
              onChange={(e) => setPassword(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className={labelClass} style={{ color: 'var(--text-secondary)' }}>Confirmer le mot de passe</label>
            <input type="password" required placeholder="••••••••" value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} />
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full font-semibold py-3 rounded-lg transition text-sm mt-2"
            style={{ background: 'linear-gradient(90deg, #FFD700, #FF8C00)', color: '#1a1400' }}
          >
            Créer mon compte
          </motion.button>

          <div className="mt-2">
            <div className="relative flex items-center justify-center mb-4">
              <div className="w-full h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
              <span className="px-3 text-xs absolute" style={{ background: 'var(--brand-dark)', color: 'var(--text-muted)' }}>ou</span>
            </div>
            <button
              type="button"
              onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_SSO_URL}/auth/google?platform=codalog`}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-lg transition text-sm font-medium"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.14)', color: 'var(--brand-white)' }}
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-4z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.6 26.8 36 24 36c-5.2 0-9.6-2.9-11.3-7.1l-6.5 5C9.6 39.6 16.3 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.5l6.2 5.2C41.1 35.3 44 30 44 24c0-1.3-.1-2.7-.4-4z"/>
              </svg>
              Continuer avec Google
            </button>
          </div>

          <p className="text-sm text-center mt-2" style={{ color: 'var(--text-secondary)' }}>
            Déjà un compte ?{" "}
            <Link href={`/signin?redirect=${redirect}`} className="font-medium hover:underline" style={{ color: 'var(--brand-cyan)' }}>
              Se connecter
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
