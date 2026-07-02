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

export const seanceListReducer = (state = { seances: [] }, action) => {
  switch (action.type) {
    case SEANCE_LIST_REQUEST:
      return { loading: true, seances: [] };
    case SEANCE_LIST_SUCCESS:
      return { loading: false, seances: action.payload };
    case SEANCE_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const seanceDetailsReducer = (state = { seance: null }, action) => {
  switch (action.type) {
    case SEANCE_DETAILS_REQUEST:
      return { loading: true, seance: null };
    case SEANCE_DETAILS_SUCCESS:
      return { loading: false, seance: action.payload };
    case SEANCE_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const seanceJoinReducer = (state = {}, action) => {
  switch (action.type) {
    case SEANCE_JOIN_REQUEST:
      return { loading: true };
    case SEANCE_JOIN_SUCCESS:
      return { loading: false, jitsiUrl: action.payload };
    case SEANCE_JOIN_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
