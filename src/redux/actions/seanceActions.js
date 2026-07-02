import Axios from 'axios';
import {
  SEANCE_LIST_REQUEST,
  SEANCE_LIST_SUCCESS,
  SEANCE_LIST_FAIL,
  SEANCE_DETAILS_REQUEST,
  SEANCE_DETAILS_SUCCESS,
  SEANCE_DETAILS_FAIL,
  SEANCE_JOIN_REQUEST,
  SEANCE_JOIN_SUCCESS,
  SEANCE_JOIN_FAIL,
} from '../constants/seanceConstants';

const API = process.env.NEXT_PUBLIC_API_URL;

export const listSeances = (niveauId) => async (dispatch, getState) => {
  dispatch({ type: SEANCE_LIST_REQUEST });
  try {
    const { userSignin: { userInfo } } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    const url = niveauId
      ? `${API}/api/seances?niveauId=${niveauId}`
      : `${API}/api/seances`;
    const { data } = await Axios.get(url, config);
    dispatch({ type: SEANCE_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: SEANCE_LIST_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const getSeanceDetails = (id) => async (dispatch, getState) => {
  dispatch({ type: SEANCE_DETAILS_REQUEST });
  try {
    const { userSignin: { userInfo } } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    const { data } = await Axios.get(`${API}/api/seances/${id}`, config);
    dispatch({ type: SEANCE_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: SEANCE_DETAILS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const joinSeance = (id) => async (dispatch, getState) => {
  dispatch({ type: SEANCE_JOIN_REQUEST });
  try {
    const { userSignin: { userInfo } } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    const { data } = await Axios.post(`${API}/api/seances/${id}/token`, {}, config);
    dispatch({ type: SEANCE_JOIN_SUCCESS, payload: data.jitsiUrl });
  } catch (error) {
    dispatch({
      type: SEANCE_JOIN_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
