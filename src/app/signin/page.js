'use client';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signin } from '../../redux/actions/userActions';
import Loader from '../../components/Loader';

export default function SigninScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const userSignin = useSelector((state) => state.userSignin || {});
  const { userInfo, loading, error } = userSignin;

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(signin(email, password, router));
  };

  useEffect(() => {
    if (userInfo) {
      if (userInfo.isAdmin) {
        router.push('/admin');
      } else {
        router.push(redirect);
      }
    }
  }, [router, redirect, userInfo]);

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      {loading ? (
        <Loader />
      ) : (
        <form
          onSubmit={submitHandler}
          className="bg-white shadow-md rounded-lg p-8 w-full max-w-md"
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
              value={email}
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
              value={password}
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

          <div className="mt-4">
            <div className="relative flex items-center justify-center mb-3">
              <div className="border-t border-gray-300 w-full"></div>
              <span className="px-3 text-gray-400 text-xs bg-white absolute">ou</span>
            </div>
            <button
              type="button"
              onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_SSO_URL}/auth/google?platform=codalog`}
              className="w-full flex items-center justify-center gap-3 py-2 px-4 border border-gray-300 rounded hover:bg-gray-50 transition duration-200 text-gray-700 font-medium"
            >
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-4z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.6 26.8 36 24 36c-5.2 0-9.6-2.9-11.3-7.1l-6.5 5C9.6 39.6 16.3 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.5l6.2 5.2C41.1 35.3 44 30 44 24c0-1.3-.1-2.7-.4-4z"/>
              </svg>
              Continuer avec Google
            </button>
          </div>

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
