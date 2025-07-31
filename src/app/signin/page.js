'use client'
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signin } from '../../redux/actions/userActions';
import Loader from '../../components/Loader'; // ✅ Import du loader

export default function SigninScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const userSignin = useSelector((state) => state.userSignin || {});
  const { userInfo, loading, error } = userSignin;

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(signin(email, password));
  };

  useEffect(() => {
    if (userInfo) {
      router.push(redirect);
    }
  }, [router, redirect, userInfo]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {loading ? (
        <Loader /> // ✅ Affichage du Loader si loading est true
      ) : (
        <form
          className="bg-white shadow-md rounded-lg p-8 w-full max-w-md"
          onSubmit={submitHandler}
        >
          <h1 className="text-2xl font-semibold text-center mb-6 text-gray-800">
            Connexion
          </h1>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}

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

          <div className="mb-6">
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

          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded transition duration-200"
          >
            Se connecter
          </button>

          <div className="mt-4 text-sm text-center">
            Nouveau client ?{' '}
            <Link
              href={`/register?redirect=${redirect}`}
              className="text-yellow-500 hover:underline"
            >
              Créez un compte
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}


