import {
  SHIPMENTS_LIST_REQUEST,
  SHIPMENTS_LIST_SUCCESS,
  SHIPMENTS_LIST_FAIL,
  SHIPMENT_ADD_REQUEST,
  SHIPMENT_ADD_SUCCESS,
  SHIPMENT_ADD_FAIL,
} from '../constants/shipmentConstants'
const initialState = {
  shipments: [],
  loading: false,
  error: null,
};
export const shipmentListReducer = (state = { shipments: [] }, action) => {
  switch (action.type) {
    case SHIPMENTS_LIST_REQUEST:
      return { loading: true, shipments: [] }
    case SHIPMENTS_LIST_SUCCESS:
      return { loading: false, shipments: action.payload }
    case SHIPMENTS_LIST_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const shipmentAddReducer = (state = {}, action) => {
  switch (action.type) {
    case SHIPMENT_ADD_REQUEST:
      return { loading: true }
    case SHIPMENT_ADD_SUCCESS:
      return { loading: false, success: true, shipment: action.payload }
    case SHIPMENT_ADD_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}