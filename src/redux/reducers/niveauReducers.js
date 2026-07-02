import {
  NIVEAU_LIST_REQUEST,
  NIVEAU_LIST_SUCCESS,
  NIVEAU_LIST_FAIL,
} from '../constants/niveauConstants';

export const niveauListReducer = (state = { niveaux: [] }, action) => {
  switch (action.type) {
    case NIVEAU_LIST_REQUEST:
      return { loading: true, niveaux: [] };
    case NIVEAU_LIST_SUCCESS:
      return { loading: false, niveaux: action.payload };
    case NIVEAU_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
