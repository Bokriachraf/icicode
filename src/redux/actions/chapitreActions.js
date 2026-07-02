import Axios from 'axios';
import {
  CHAPITRE_LIST_REQUEST,
  CHAPITRE_LIST_SUCCESS,
  CHAPITRE_LIST_FAIL,
  CHAPITRE_DETAILS_REQUEST,
  CHAPITRE_DETAILS_SUCCESS,
  CHAPITRE_DETAILS_FAIL,
} from '../constants/chapitreConstants';

const API = process.env.NEXT_PUBLIC_API_URL;

export const listChapitres = (niveauId) => async (dispatch, getState) => {
  dispatch({ type: CHAPITRE_LIST_REQUEST });
  try {
    const { userSignin: { userInfo } } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    const url = niveauId
      ? `${API}/api/chapitres?niveauId=${niveauId}`
      : `${API}/api/chapitres`;
    const { data } = await Axios.get(url, config);
    dispatch({ type: CHAPITRE_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: CHAPITRE_LIST_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const getChapitreDetails = (id) => async (dispatch, getState) => {
  dispatch({ type: CHAPITRE_DETAILS_REQUEST });
  try {
    const { userSignin: { userInfo } } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    const { data } = await Axios.get(`${API}/api/chapitres/${id}`, config);
    dispatch({ type: CHAPITRE_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: CHAPITRE_DETAILS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
