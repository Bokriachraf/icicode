import axios from 'axios'
import {
  SHIPMENTS_LIST_REQUEST,
  SHIPMENTS_LIST_SUCCESS,
  SHIPMENTS_LIST_FAIL,
  SHIPMENT_ADD_REQUEST,
  SHIPMENT_ADD_SUCCESS,
  SHIPMENT_ADD_FAIL,
} from '../constants/shipmentConstants'

const API = process.env.NEXT_PUBLIC_API_URL

export const listShipments = () => async (dispatch) => {
  try {
    dispatch({ type: SHIPMENTS_LIST_REQUEST })
    const { data } = await axios.get(`${API}/api/shipments`)
    dispatch({ type: SHIPMENTS_LIST_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: SHIPMENTS_LIST_FAIL,
      payload: error.response?.data?.message || error.message,
    })
  }
}

export const addShipment = (shipment) => async (dispatch) => {
  try {
    dispatch({ type: SHIPMENT_ADD_REQUEST })
    const { data } = await axios.post(`${API}/api/shipments`, shipment)
    dispatch({ type: SHIPMENT_ADD_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: SHIPMENT_ADD_FAIL,
      payload: error.response?.data?.message || error.message,
    })
  }
}