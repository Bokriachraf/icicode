import axios from 'axios';
import {
  SET_INSCRIPTION_DATA,
  RESET_INSCRIPTION_DATA,
  INSCRIPTION_SUBMIT_REQUEST,
  INSCRIPTION_SUBMIT_SUCCESS,
  INSCRIPTION_SUBMIT_FAIL,
  INSCRIPTION_LIST_MY_REQUEST,
  INSCRIPTION_LIST_MY_SUCCESS,
  INSCRIPTION_LIST_MY_FAIL,
  INSCRIPTION_DETAILS_REQUEST,
  INSCRIPTION_DETAILS_SUCCESS,
  INSCRIPTION_DETAILS_FAIL,
  INSCRIPTION_LIST_ADMIN_REQUEST,
  INSCRIPTION_LIST_ADMIN_SUCCESS,
  INSCRIPTION_LIST_ADMIN_FAIL,
  INSCRIPTION_DELETE_REQUEST,
    INSCRIPTION_DELETE_SUCCESS,
    INSCRIPTION_DELETE_FAIL,
    INSCRIPTION_UPDATE_STATUS_REQUEST,
    INSCRIPTION_UPDATE_STATUS_SUCCESS,
    INSCRIPTION_UPDATE_STATUS_FAIL,
  
} from '../constants/inscriptionConstants';

const API = process.env.NEXT_PUBLIC_API_URL;

export const setInscriptionData = (data) => ({
  type: SET_INSCRIPTION_DATA,
  payload: data,
});
export const resetInscriptionData = () => ({
  type: RESET_INSCRIPTION_DATA,
});

export const submitInscription = () => async (dispatch, getState) => {
  try {
    dispatch({ type: INSCRIPTION_SUBMIT_REQUEST });

    const {
      inscription: { inscriptionData },
    userSignin: { userInfo },
    } = getState();

    const response = await fetch(`${API}/api/inscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(userInfo?.token && { Authorization: `Bearer ${userInfo.token}` }),
      },
      body: JSON.stringify(inscriptionData),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || 'Erreur lors de l’envoi d inscription');

    dispatch({ type: INSCRIPTION_SUBMIT_SUCCESS, payload: data });

    return data; // ✅ pour permettre à Step3 de continuer
  } catch (error) {
    dispatch({ type: INSCRIPTION_SUBMIT_FAIL, payload: error.message });
    throw error; // ✅ pour activer le catch() dans Step3
  }
};
export const listMyInscription = () => async (dispatch, getState) => {
  try {
    dispatch({ type: INSCRIPTION_LIST_MY_REQUEST })

    const {
      userSignin: { userInfo },
    } = getState()

    const response = await fetch(`${API}/api/inscription/mine`, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) throw new Error(data.message || 'Erreur de récupération')

    dispatch({ type: INSCRIPTION_LIST_MY_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: INSCRIPTION_LIST_MY_FAIL,
      payload: error.message,
    })
  }
}

export const getInscriptionDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: INSCRIPTION_DETAILS_REQUEST })

    const {
      userSignin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }
    const isAdmin = userInfo?.isAdmin // ✅
    const endpoint = isAdmin
      ? `${API}/api/inscription/admin/${id}`  // ✅ route spéciale pour admin
      : `${API}/api/inscription/${id}`        // route normale pour user

    const { data } = await axios.get(endpoint, config)

    dispatch({ type: INSCRIPTION_DETAILS_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: INSCRIPTION_DETAILS_FAIL,
      payload: error.response?.data?.message || error.message,
    })
  }
}

export const deleteInscription= (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: INSCRIPTION_DELETE_REQUEST })
    const {
      userSignin: { userInfo },
    } = getState()
    const response = await fetch(`${API}/api/inscription/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    })
    if (!response.ok) throw new Error('Erreur suppression')
    dispatch({ type: INSCRIPTION_DELETE_SUCCESS, payload: id })
  } catch (error) {
    dispatch({ type: INSCRIPTION_DELETE_FAIL, payload: error.message })
  }
}

export const updateInscriptionStatus = (id, status) => async (dispatch, getState) => {
  try {
    dispatch({ type: INSCRIPTION_UPDATE_STATUS_REQUEST })
    const {
      userSignin: { userInfo },
    } = getState()
    const response = await fetch(`${API}/api/inscription/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
      body: JSON.stringify({ status }),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Erreur maj')
    dispatch({ type: INSCRIPTION_UPDATE_STATUS_SUCCESS, payload: data })
  } catch (error) {
    dispatch({ type: INSCRIPTION_UPDATE_STATUS_FAIL, payload: error.message })
  }
}


export const listAllInscription = () => async (dispatch, getState) => {
  try {
    dispatch({ type: INSCRIPTION_LIST_ADMIN_REQUEST })

    const {
      userSignin: { userInfo },
    } = getState()

    const response = await fetch(`${API}/api/inscription/admin`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) throw new Error(data.message || 'Erreur')

    dispatch({ type: INSCRIPTION_LIST_ADMIN_SUCCESS, payload: data })
  } catch (error) {
    dispatch({ type: INSCRIPTION_LIST_ADMIN_FAIL, payload: error.message })
  }
}
export const getInscriptionDetailsAdmin = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: INSCRIPTION_DETAILS_REQUEST })

    const {
      userSignin: { userInfo },
    } = getState()

    const { data } = await axios.get(`${API}/api/inscription/admin/${id}`, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    })

    dispatch({ type: INSCRIPTION_DETAILS_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: INSCRIPTION_DETAILS_FAIL,
      payload: error.response?.data?.message || error.message,
    })
  }
}

export const marquerTousInscriptionCommeVus = () => async (dispatch, getState) => {
  const {
    userSignin: { userInfo },
  } = getState()

  try {
    await fetch(`${API}/api/inscription/admin/marque-comme-vu`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    })

    // ✅ Rafraîchir la liste des inscription après avoir mis à jour
    dispatch(listAllInscription())
  } catch (error) {
    console.error('Erreur lors de la mise à jour du champ vu', error)
  }
}
