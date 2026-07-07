import {
  CHAPITRE_LIST_REQUEST,
  CHAPITRE_LIST_SUCCESS,
  CHAPITRE_LIST_FAIL,
  CHAPITRE_DETAILS_REQUEST,
  CHAPITRE_DETAILS_SUCCESS,
  CHAPITRE_DETAILS_FAIL,
} from '../constants/chapitreConstants';
import { USER_SIGNIN_SUCCESS, USER_SIGNOUT } from '../constants/userConstants';

export const chapitreListReducer = (state = { chapitres: [] }, action) => {
  switch (action.type) {
    case CHAPITRE_LIST_REQUEST:
      return { loading: true, chapitres: [] };
    case CHAPITRE_LIST_SUCCESS:
      return { loading: false, chapitres: action.payload };
    case CHAPITRE_LIST_FAIL:
      return { loading: false, error: action.payload };
    case USER_SIGNIN_SUCCESS:
    case USER_SIGNOUT:
      return { chapitres: [] };
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
    case USER_SIGNIN_SUCCESS:
    case USER_SIGNOUT:
      return { chapitre: null };
    default:
      return state;
  }
};
