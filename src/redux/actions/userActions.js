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
const SSO = process.env.NEXT_PUBLIC_SSO_URL;

// ── REGISTER ──────────────────────────────────────────────────────────────────
export const register = (name, email, password, router, niveauId) => async (dispatch) => {
  dispatch({ type: USER_REGISTER_REQUEST, payload: { email, password } });
  try {
    const { data } = await Axios.post(`${SSO}/api/auth/register`, {
      name, email, password, niveauId: niveauId || null,
    });
    dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
    dispatch({ type: USER_SIGNIN_SUCCESS, payload: data });
    localStorage.setItem('userInfo', JSON.stringify(data));
    if (data.isAdmin) router.push('/admin');
    else router.push('/dashboard');
  } catch (error) {
    dispatch({ type: USER_REGISTER_FAIL, payload: error.response?.data?.message || error.message });
  }
};

// ── SIGNIN ────────────────────────────────────────────────────────────────────
export const signin = (email, password, router) => async (dispatch) => {
  dispatch({ type: USER_SIGNIN_REQUEST, payload: { email, password } });
  try {
    const { data } = await Axios.post(`${SSO}/api/auth/signin`, { email, password });
    dispatch({ type: USER_SIGNIN_SUCCESS, payload: data });
    localStorage.setItem('userInfo', JSON.stringify(data));
    if (data.isAdmin) router.push('/admin');
    else router.push('/dashboard');
  } catch (error) {
    dispatch({ type: USER_SIGNIN_FAIL, payload: error.response?.data?.message || error.message });
  }
};

// ── SIGNOUT ───────────────────────────────────────────────────────────────────
export const signout = (router) => (dispatch) => {
  localStorage.removeItem('userInfo');
  dispatch({ type: USER_SIGNOUT });
};

// ── COMPLETE INSCRIPTION ──────────────────────────────────────────────────────
// Étape 1 : met à jour Data1 (niveauId, infos perso, isInscriptionComplete=true)
// Étape 2 : synchronise sso-db et reçoit un nouveau token frais
export const completeInscription = (inscriptionData) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_UPDATE_REQUEST });

    const { userSignin: { userInfo } } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        'Content-Type': 'application/json',
      },
    };

    // Étape 1 — Data1
    await Axios.put(`${API}/api/inscription/complete`, inscriptionData, config);

    // Étape 2 — SSO : synchronise et renvoie token frais avec isInscriptionComplete=true
    const { data } = await Axios.put(`${SSO}/api/auth/complete`, {}, config);

    const updatedUserInfo = {
      ...userInfo,
      ...data,
      token: data.token,
    };

    dispatch({ type: USER_UPDATE_SUCCESS, payload: updatedUserInfo });
    dispatch({ type: USER_SIGNIN_SUCCESS, payload: updatedUserInfo });
    localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
  } catch (error) {
    dispatch({ type: USER_UPDATE_FAIL, payload: error.response?.data?.message || error.message });
    console.error('Erreur inscription complète :', error);
  }
};

// ── LIST USERS (admin) ────────────────────────────────────────────────────────
export const listUsers = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_LIST_REQUEST });
    const { userSignin: { userInfo } } = getState();
    const { data } = await Axios.get(`${API}/api/users`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: USER_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: USER_LIST_FAIL, payload: error.response?.data?.message || error.message });
  }
};

// ── DELETE USER (admin) ───────────────────────────────────────────────────────
export const deleteUser = (userId) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_DELETE_REQUEST });
    const { userSignin: { userInfo } } = getState();
    await Axios.delete(`${API}/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: USER_DELETE_SUCCESS });
  } catch (error) {
    dispatch({ type: USER_DELETE_FAIL, payload: error.response?.data?.message || error.message });
  }
};
