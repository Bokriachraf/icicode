import axios from 'axios'
import {
    COURSE_CREATE_REQUEST,
  COURSE_CREATE_SUCCESS,
  COURSE_CREATE_FAIL,
  COURSE_LIST_REQUEST,
  COURSE_LIST_SUCCESS,
  COURSE_LIST_FAIL
} from '../constants/courseConstants'

const API = process.env.NEXT_PUBLIC_API_URL;

export const listCourses = () => async (dispatch) => {
  try {
    dispatch({ type: COURSE_LIST_REQUEST })
    const { data } = await axios.get(`${API}/api/courses`)
    dispatch({ type: COURSE_LIST_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: COURSE_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}


// export const listCourses = () => async (dispatch) => {
//   try {
//     dispatch({ type: COURSE_LIST_REQUEST })
//     const { data } = await axios.get(`${API}/api/courses`)
//     dispatch({ type: COURSE_LIST_SUCCESS, payload: data })
//   } catch (error) {
//     dispatch({
//       type: COURSE_LIST_FAIL,
//       payload:
//         error.response && error.response.data.message
//           ? error.response.data.message
//           : error.message,
//     })
//   }
// }

export const createCourse = (courseData) => async (dispatch, getState) => {
  try {
    dispatch({ type: COURSE_CREATE_REQUEST })

    const {
      userSignin: { userInfo },
    } = getState()

    const { data } = await axios.post(`${API}/api/courses`, courseData, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    })

    dispatch({ type: COURSE_CREATE_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: COURSE_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}
