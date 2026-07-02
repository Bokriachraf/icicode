import Axios from 'axios';
import {
  NIVEAU_LIST_REQUEST,
  NIVEAU_LIST_SUCCESS,
  NIVEAU_LIST_FAIL,
} from '../constants/niveauConstants';

const API = process.env.NEXT_PUBLIC_API_URL;

export const listNiveaux = () => async (dispatch) => {
  dispatch({ type: NIVEAU_LIST_REQUEST });
  try {
    const { data } = await Axios.get(`${API}/api/niveaux`);
    dispatch({ type: NIVEAU_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: NIVEAU_LIST_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
