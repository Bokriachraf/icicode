import { configureStore } from '@reduxjs/toolkit'
import { shipmentListReducer,shipmentAddReducer } from './reducers/shipmentReducers';
import {inscriptionReducer,inscriptionAdminListReducer,inscriptionListMyReducer,inscriptionDetailsReducer} from './reducers/inscriptionReducers'
import {  userRegisterReducer,userSigninReducer,userDeleteReducer,userListReducer  } from './reducers/userReducers';

export function makeStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      shipmentList: shipmentListReducer,
      shipmentAdd: shipmentAddReducer,
      inscription: inscriptionReducer,
      dinscriptionListMy: inscriptionListMyReducer,
      userSignin: userSigninReducer,
      userRegister: userRegisterReducer,
      inscriptionDetails: inscriptionDetailsReducer,
      inscriptionAdminList: inscriptionAdminListReducer,
      userList: userListReducer,
      userDelete: userDeleteReducer,

    },
    preloadedState,
  });
}