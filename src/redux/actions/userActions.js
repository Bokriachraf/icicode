import Axios from 'axios';
import {
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_SIGNIN_FAIL,
  USER_SIGNIN_REQUEST,
  USER_SIGNIN_SUCCESS,
  USER_SIGNOUT,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_REQUEST,
  USER_UPDATE_FAIL,
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_DELETE_FAIL,
} from '../constants/userConstants';

const API = process.env.NEXT_PUBLIC_API_URL;

// --- REGISTER ---
export const register = (name, email, password, router) => async (dispatch) => {
  dispatch({ type: USER_REGISTER_REQUEST, payload: { email, password } });
  try {
    const { data } = await Axios.post(`${API}/api/users/register`, {
      name,
      email,
      password,
    });

    dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
    dispatch({ type: USER_SIGNIN_SUCCESS, payload: data });

    localStorage.setItem('userInfo', JSON.stringify(data));

    // 👉 Redirection après inscription
    if (data.isAdmin) {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload:
        error.response?.data?.message || error.message,
    });
  }
};

// --- SIGNIN ---
export const signin = (email, password, router) => async (dispatch) => {
  dispatch({ type: USER_SIGNIN_REQUEST, payload: { email, password } });
  try {
    const { data } = await Axios.post(`${API}/api/users/signin`, {
      email,
      password,
    });

    dispatch({ type: USER_SIGNIN_SUCCESS, payload: data });
    localStorage.setItem('userInfo', JSON.stringify(data));

    // 👉 Redirection après connexion
    if (data.isAdmin) {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  } catch (error) {
    dispatch({
      type: USER_SIGNIN_FAIL,
      payload:
        error.response?.data?.message || error.message,
    });
  }
};

// --- SIGNOUT ---
export const signout = (router) => (dispatch) => {
  localStorage.removeItem('userInfo');
  dispatch({ type: USER_SIGNOUT });
  // router.push('/signin');
};

// --- LIST USERS (admin only) ---
export const listUsers = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_LIST_REQUEST });

    const {
      userSignin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await Axios.get(`${API}/api/users`, config);
    dispatch({ type: USER_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USER_LIST_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// --- DELETE USER (admin only) ---
export const deleteUser = (userId) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_DELETE_REQUEST });

    const {
      userSignin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await Axios.delete(`${API}/api/users/${userId}`, config);

    dispatch({ type: USER_DELETE_SUCCESS });
  } catch (error) {
    dispatch({
      type: USER_DELETE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
// export const completeInscription = (inscriptionData) => async (dispatch, getState) => {
//   try {
//     dispatch({ type: USER_UPDATE_REQUEST }); // montre un loader si tu veux

//     const {
//       userSignin: { userInfo },
//     } = getState();

//     const config = {
//       headers: {
//         Authorization: `Bearer ${userInfo.token}`,
//         'Content-Type': 'application/json',
//       },
//     };

//     const { data } = await Axios.put(`${API}/api/inscription/complete`, inscriptionData, config);

//     // ✅ Met à jour Redux + localStorage
//     dispatch({ type: USER_UPDATE_SUCCESS, payload: data });
//     dispatch({ type: USER_SIGNIN_SUCCESS, payload: data });
//     localStorage.setItem('userInfo', JSON.stringify(data));
//   } catch (error) {
//     dispatch({
//       type: USER_UPDATE_FAIL,
//       payload: error.response?.data?.message || error.message,
//     });
//     console.error('Erreur inscription complète :', error);
//   }
// };
export const completeInscription = (inscriptionData) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_UPDATE_REQUEST });

    const {
      userSignin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        'Content-Type': 'application/json',
      },
    };

    const { data } = await Axios.put(`${API}/api/inscription/complete`, inscriptionData, config);

    // ✅ Fusionner l'ancien userInfo et les nouvelles données reçues
    const updatedUserInfo = {
      ...userInfo,              // garde token, email, name, etc.
      ...data,                  // ajoute les nouvelles infos du backend
      isInscriptionComplete: true, // s’assure que ce flag soit mis à jour
    };

    // ✅ Met à jour Redux
    dispatch({ type: USER_UPDATE_SUCCESS, payload: updatedUserInfo });
    dispatch({ type: USER_SIGNIN_SUCCESS, payload: updatedUserInfo });

    // ✅ Sauvegarde dans localStorage sans perdre le token
    localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
  } catch (error) {
    dispatch({
      type: USER_UPDATE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    console.error('Erreur inscription complète :', error);
  }
};

// import Axios from 'axios';
// import {
//    USER_REGISTER_FAIL,
//   USER_REGISTER_REQUEST,
//   USER_REGISTER_SUCCESS,
//   USER_SIGNIN_FAIL,
//   USER_SIGNIN_REQUEST,
//   USER_SIGNIN_SUCCESS,
//   USER_SIGNOUT,
//     USER_LIST_REQUEST,
//   USER_LIST_SUCCESS,
//   USER_LIST_FAIL,
//     USER_DELETE_REQUEST,
//   USER_DELETE_SUCCESS,
//   USER_DELETE_FAIL,
// } from '../constants/userConstants';

// const API = process.env.NEXT_PUBLIC_API_URL

// export const register = (name, email, password) => async (dispatch) => {
//   dispatch({ type: USER_REGISTER_REQUEST, payload: { email, password } });
//   try {
//     const { data } = await Axios.post(`${API}/api/users/register`, {
//       name,
//       email,
//       password,
//     });
//     dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
//     dispatch({ type: USER_SIGNIN_SUCCESS, payload: data });
//     localStorage.setItem('userInfo', JSON.stringify(data));
//   } catch (error) {
//     dispatch({
//       type: USER_REGISTER_FAIL,
//       payload:
//         error.response && error.response.data.message
//           ? error.response.data.message
//           : error.message,
//     });
//   }
// };


// export const signin = (email, password) => async (dispatch) => {
//   dispatch({ type: USER_SIGNIN_REQUEST, payload: { email, password } });
//   try {
//     const { data } = await Axios.post(`${API}/api/users/signin`, { email, password });
//     dispatch({ type: USER_SIGNIN_SUCCESS, payload: data });
//     localStorage.setItem('userInfo', JSON.stringify(data));
//   } catch (error) {
//     dispatch({
//       type: USER_SIGNIN_FAIL,
//       payload:
//         error.response && error.response.data.message
//           ? error.response.data.message
//           : error.message,
//     });
//   }
// };
// export const signout = () => (dispatch) => {
//   localStorage.removeItem('userInfo');
//   dispatch({ type: USER_SIGNOUT });
// };

// export const listUsers = () => async (dispatch, getState) => {
//   try {
//     dispatch({ type: USER_LIST_REQUEST })

//     const {
//       userSignin: { userInfo },
//     } = getState()

//     const config = {
//       headers: {
//         Authorization: `Bearer ${userInfo.token}`,
//       },
//     }

//     const { data } = await Axios.get(`${API}/api/users`, config)

//     dispatch({ type: USER_LIST_SUCCESS, payload: data })
//   } catch (error) {
//     dispatch({
//       type: USER_LIST_FAIL,
//       payload:
//         error.response?.data?.message || error.message,
//     })
//   }
// }


// export const deleteUser = (userId) => async (dispatch, getState) => {
//   try {
//     dispatch({ type: USER_DELETE_REQUEST })

//     const {
//       userSignin: { userInfo },
//     } = getState()

//     const config = {
//       headers: {
//         Authorization: `Bearer ${userInfo.token}`,
//       },
//     }

//     await Axios.delete(`${API}/api/users/${userId}`, config)

//     dispatch({ type: USER_DELETE_SUCCESS })
//   } catch (error) {
//     dispatch({
//       type: USER_DELETE_FAIL,
//       payload: error.response?.data?.message || error.message,
//     })
//   }
// }
