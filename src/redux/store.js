
import { configureStore } from '@reduxjs/toolkit'
import { shipmentListReducer,shipmentAddReducer } from './reducers/shipmentReducers';
import {inscriptionReducer,inscriptionAdminListReducer,inscriptionListMyReducer,inscriptionDetailsReducer} from './reducers/inscriptionReducers'
import {  userRegisterReducer,userSigninReducer,userDeleteReducer,userListReducer  } from './reducers/userReducers';
import {
  courseCreateReducer,courseListReducer,
} from './reducers/courseReducers.js'

import {
  userUpdateReducer,
} from './reducers/userReducers.js'
export function makeStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      courseList: courseListReducer,
      courseCreate: courseCreateReducer,
      shipmentList: shipmentListReducer,
      shipmentAdd: shipmentAddReducer,
      inscription: inscriptionReducer,
      inscriptionListMy: inscriptionListMyReducer,
      userSignin: userSigninReducer,
      userRegister: userRegisterReducer,
      inscriptionDetails: inscriptionDetailsReducer,
      inscriptionAdminList: inscriptionAdminListReducer,
      userList: userListReducer,
      userDelete: userDeleteReducer,
      userUpdate: userUpdateReducer,
    },
    preloadedState,
  });
}

// import { configureStore } from '@reduxjs/toolkit';
// import {
//   shipmentListReducer,
//   shipmentAddReducer,
// } from './reducers/shipmentReducers';
// import {
//   inscriptionReducer,
//   inscriptionAdminListReducer,
//   inscriptionListMyReducer,
//   inscriptionDetailsReducer,
// } from './reducers/inscriptionReducers';
// import {
//   userRegisterReducer,
//   userSigninReducer,
//   userDeleteReducer,
//   userListReducer,
//   userUpdateReducer,
// } from './reducers/userReducers';
// import {
//   courseCreateReducer,
//   courseListReducer,
// } from './reducers/courseReducers.js';

// // ✅ 1. Charger les infos utilisateur depuis localStorage
// const userInfoFromStorage =
//   typeof window !== 'undefined' && localStorage.getItem('userInfo')
//     ? JSON.parse(localStorage.getItem('userInfo'))
//     : null;

// // ✅ 2. Définir l’état initial
// const initialState = {
//   userSignin: { userInfo: userInfoFromStorage },
// };

// // ✅ 3. Créer le store avec preloadedState
// export function makeStore(preloadedState = {}) {
//   return configureStore({
//     reducer: {
//       courseList: courseListReducer,
//       courseCreate: courseCreateReducer,
//       shipmentList: shipmentListReducer,
//       shipmentAdd: shipmentAddReducer,
//       inscription: inscriptionReducer,
//       inscriptionListMy: inscriptionListMyReducer, // <- petite coquille : devrais-tu corriger en "inscriptionListMy" ?
//       userSignin: userSigninReducer,
//       userRegister: userRegisterReducer,
//       inscriptionDetails: inscriptionDetailsReducer,
//       inscriptionAdminList: inscriptionAdminListReducer,
//       userList: userListReducer,
//       userDelete: userDeleteReducer,
//       userUpdate: userUpdateReducer,
//     },
//     preloadedState: { ...initialState, ...preloadedState },
//   });
// }

