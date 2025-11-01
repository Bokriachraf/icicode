import {
     COURSE_CREATE_REQUEST,
  COURSE_CREATE_SUCCESS,
  COURSE_CREATE_FAIL,
  COURSE_LIST_REQUEST,
  COURSE_LIST_SUCCESS,
  COURSE_LIST_FAIL
} from '../constants/courseConstants'


export const courseCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case COURSE_CREATE_REQUEST:
      return { loading: true }
    case COURSE_CREATE_SUCCESS:
      return { loading: false, success: true, course: action.payload }
    case COURSE_CREATE_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const courseListReducer = (state = { courses: [] }, action) => {
  switch (action.type) {
    case COURSE_LIST_REQUEST:
      return { loading: true, courses: [] }
    case COURSE_LIST_SUCCESS:
      return { loading: false, courses: action.payload }
    case COURSE_LIST_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}