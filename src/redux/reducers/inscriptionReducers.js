import { SET_INSCRIPTION_DATA, RESET_INSCRIPTION_DATA,INSCRIPTION_SUBMIT_REQUEST,
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
  INSCRIPTION_UPDATE_STATUS_SUCCESS,
  INSCRIPTION_UPDATE_STATUS_FAIL,
 } from '../constants/inscriptionConstants';

const initialState = {
  inscriptionData: {},
  loading: false,
  success: false,
  error: null,
};

const inscriptionReducer = (state = initialState, action) => {
  switch (action.type) {
   case SET_INSCRIPTION_DATA:
      return {
        ...state,
        inscriptionData: { ...state.inscriptionData, ...action.payload },
      };
    case INSCRIPTION_SUBMIT_REQUEST:
      return { ...state, loading: true, error: null };
    case INSCRIPTION_SUBMIT_SUCCESS:
      return { ...state, loading: false, success: true };
    case INSCRIPTION_SUBMIT_FAIL:
      return { ...state, loading: false, error: action.payload };
    case RESET_INSCRIPTION_DATA:
      return initialState;
    default:
      return state;
  }
};

 const inscriptionListMyReducer = (
  state = { loading: false, inscription: [], error: null },
  action
) => {
  switch (action.type) {
    case INSCRIPTION_LIST_MY_REQUEST:
      return { loading: true, inscription: [] }
    case INSCRIPTION_LIST_MY_SUCCESS:
      return { loading: false, inscription: action.payload }
    case INSCRIPTION_LIST_MY_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

const inscriptionDetailsReducer = (state = { inscription: {} }, action) => {
  switch (action.type) {
    case INSCRIPTION_DETAILS_REQUEST:
      return { loading: true, inscription: {} }
    case INSCRIPTION_DETAILS_SUCCESS:
      return { loading: false, inscription: action.payload }
    case INSCRIPTION_DETAILS_FAIL:
      return { loading: false, error: action.payload }
    case INSCRIPTION_UPDATE_STATUS_SUCCESS:
  return {
    ...state,
    loading: false,
    inscription: action.payload,
  }
case INSCRIPTION_UPDATE_STATUS_FAIL:
  return {
    ...state,
    loading: false,
    error: action.payload,
  }
      default:
      return state
  }
}
 const inscriptionAdminListReducer = (state = { inscription: [] }, action) => {
  switch (action.type) {
    case INSCRIPTION_LIST_ADMIN_REQUEST:
      return { loading: true }
    case INSCRIPTION_LIST_ADMIN_SUCCESS:
      return { loading: false, inscription: action.payload }
    case INSCRIPTION_LIST_ADMIN_FAIL:
      return { loading: false, error: action.payload }
   case INSCRIPTION_DELETE_REQUEST:
      return { ...state, loading: true }
    case INSCRIPTION_DELETE_SUCCESS:
      return {
        ...state,
        loading: false,
        inscription: state.inscription.filter((d) => d._id !== action.payload),
      }
    case INSCRIPTION_DELETE_FAIL:
      return { ...state, loading: false, error: action.payload }

    // 🟡 Mettre à jour le statut d’une inscription
    case INSCRIPTION_UPDATE_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        inscription: state.inscription.map((d) =>
          d._id === action.payload._id ? action.payload : d
        ),
      }

    default:
      return state
  }
}
export { inscriptionReducer,inscriptionAdminListReducer, inscriptionListMyReducer, inscriptionDetailsReducer };
