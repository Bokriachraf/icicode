'use client';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { USER_SIGNIN_SUCCESS } from '../../../redux/constants/userConstants';
import Loader from '../../../components/Loader';

export default function AuthCallback() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const platform = searchParams.get('platform');

    if (!token) {
      router.push('/signin');
      return;
    }

    if (platform === 'kickoora') {
      window.location.href = `http://localhost:3001/auth/callback?token=${token}&platform=kickoora`;
      return;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));

    const userInfo = {
      _id: payload._id,
      name: payload.name,
      email: payload.email,
      isAdmin: payload.isAdmin,
      role: payload.role,
      roles: payload.roles,
      token,
    };

    dispatch({ type: USER_SIGNIN_SUCCESS, payload: userInfo });
    localStorage.setItem('userInfo', JSON.stringify(userInfo));

    router.push('/dashboard');
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader />
    </div>
  );
}
