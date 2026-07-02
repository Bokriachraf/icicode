"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { register } from "../../redux/actions/userActions";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.userRegister || {});

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("❌ Les mots de passe ne correspondent pas.");
      return;
    }
    dispatch(register(name, email, password, router));
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-10 px-4">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">
          Créer un compte
        </h1>
        <p className="text-center text-gray-400 text-sm mb-6">
          Rejoignez Codalog et commencez à apprendre
        </p>

        {loading && (
          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded mb-4 text-sm">
            Création en cours...
          </div>
        )}
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Nom complet</label>
            <input
              type="text"
              required
              placeholder="Votre nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Adresse e-mail</label>
            <input
              type="email"
              required
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Mot de passe</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2.5 px-4 rounded-xl transition text-sm mt-2"
          >
            Créer mon compte
          </button>

          <div className="mt-2">
            <div className="relative flex items-center justify-center mb-3">
              <div className="border-t border-gray-200 w-full" />
              <span className="px-3 text-gray-400 text-xs bg-white absolute">ou</span>
            </div>
            <button
              type="button"
              onClick={() =>
                window.location.href = `${process.env.NEXT_PUBLIC_SSO_URL}/auth/google?platform=codalog`
              }
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition text-sm text-gray-700 font-medium"
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

          <p className="text-sm text-center text-gray-500 mt-2">
            Déjà un compte ?{" "}
            <Link
              href={`/signin?redirect=${redirect}`}
              className="text-yellow-500 hover:underline font-medium"
            >
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
