import {
  CHAPITRE_LIST_REQUEST,
  CHAPITRE_LIST_SUCCESS,
  CHAPITRE_LIST_FAIL,
  CHAPITRE_DETAILS_REQUEST,
  CHAPITRE_DETAILS_SUCCESS,
  CHAPITRE_DETAILS_FAIL,
} from '../constants/chapitreConstants';

export const chapitreListReducer = (state = { chapitres: [] }, action) => {
  switch (action.type) {
    case CHAPITRE_LIST_REQUEST:
      return { loading: true, chapitres: [] };
    case CHAPITRE_LIST_SUCCESS:
      return { loading: false, chapitres: action.payload };
    case CHAPITRE_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const chapitreDetailsReducer = (state = { chapitre: null }, action) => {
  switch (action.type) {
    case CHAPITRE_DETAILS_REQUEST:
      return { loading: true, chapitre: null };
    case CHAPITRE_DETAILS_SUCCESS:
      return { loading: false, chapitre: action.payload };
    case CHAPITRE_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
