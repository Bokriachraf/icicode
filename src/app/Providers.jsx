'use client';

import { Provider } from 'react-redux';
import { useEffect,  useState } from 'react';
import { makeStore } from '../redux/store';

export default function Providers({ children }) {
  const [store, setStore] = useState(null);

  useEffect(() => {
    const userInfo = typeof window !== 'undefined' && localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null;

    const preloadedState = {
      userSignin: { userInfo },
      userRegister: {},  
      inscription: {},
    };

    const newStore = makeStore(preloadedState);
    setStore(newStore);
  }, []);

  if (!store) return null; // ou spinner de chargement

  return <Provider store={store}>{children}</Provider>;
}

// 'use client'

// import { Provider } from 'react-redux'
// import { store } from '../redux/store'

// export default function Providers({ children }) {
//   return <Provider store={store}>{children}</Provider>
// }