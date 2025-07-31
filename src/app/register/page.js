'use client';

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { register } from '../../redux/actions/userActions';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const userRegister = useSelector((state) => state.userRegister || {});
  const { userInfo, loading, error } = userRegister;

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas.');
    } else {
      dispatch(register(name, email, password));
    }
  };

  useEffect(() => {
    if (userInfo) {
      router.push(redirect);
    }
  }, [router, redirect, userInfo]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-md"
        onSubmit={submitHandler}
      >
        <h1 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Créer un compte
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 mb-1">
            Nom complet
          </label>
          <input
            type="text"
            id="name"
            placeholder="Entrez votre nom"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-1">
            Adresse e-mail
          </label>
          <input
            type="email"
            id="email"
            placeholder="Entrez votre email"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 mb-1">
            Mot de passe
          </label>
          <input
            type="password"
            id="password"
            placeholder="Entrez votre mot de passe"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-gray-700 mb-1">
            Confirmez le mot de passe
          </label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Confirmez votre mot de passe"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded transition duration-200"
        >
          Créer un compte
        </button>

        <div className="mt-4 text-sm text-center">
          Vous avez déjà un compte ?{' '}
          <Link
            href={`/signin?redirect=${redirect}`}
            className="text-yellow-500 hover:underline"
          >
            Connectez-vous
          </Link>
        </div>
      </form>
    </div>
  );
}