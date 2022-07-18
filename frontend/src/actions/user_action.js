import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    REGISTER_REQUEST,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAIL,
    LOGOUT_SUCCESS,
    LOGOUT_FAIL,
    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_SUCCESS,
    UPDATE_PROFILE_FAIL,
    UPDATE_PASSWORD_REQUEST,
    UPDATE_PASSWORD_SUCCESS,
    UPDATE_PASSWORD_FAIL,
    FORGOT_PASSWORD_REQUEST,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_FAIL,
    NEW_PASSWORD_REQUEST,
    NEW_PASSWORD_SUCCESS,
    NEW_PASSWORD_FAIL,
    CLEAR_ERRORS,
    ALL_USERS_REQUEST,
    ALL_USERS_SUCCESS,
    ALL_USERS_FAIL,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAIL,
    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_DETAILS_FAIL,
    DELETE_USER_REQUEST,
    DELETE_USER_SUCCESS, DELETE_USER_FAIL
} from '../consts/user_consts';

import axios from "axios";

export const login = (email, password) => async (dispatch) => {
    let url = `/api/v1/login`
    try {

        dispatch({type: LOGIN_REQUEST});
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const {data} = await axios.post(url, {email, password}, config);

        dispatch({
            type: LOGIN_SUCCESS,
            payload: data.user
        })

    } catch (error) {
        dispatch({
            type: LOGIN_FAIL,
            payload: error.response.data.message
        });
    }
}

export const register = (userData) => async (dispatch) => {
    let url = `/api/v1/register`
    try {
        dispatch({type: REGISTER_REQUEST});
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        const {data} = await axios.post(url, userData, config);

        dispatch({
            type: REGISTER_SUCCESS,
            payload: data.user
        })

    } catch (error) {
        console.log(error.response.data.message)

        dispatch({
            type: REGISTER_FAIL,
            payload: error.response.data.message.split(':')[2]
        });
    }
}


export const loadUser = () => async (dispatch) => {
    let url = `/api/v1/me`;
    try {
        dispatch({type: LOAD_USER_REQUEST});
        const {data} = await axios.get(url);

        dispatch({
            type: LOAD_USER_SUCCESS,
            payload: data.user
        })

    } catch (error) {
        // console.log(error.response)
        dispatch({
            type: LOAD_USER_FAIL,
            payload: error.response.data.message
        });
    }
}

export const logout = () => async (dispatch) => {
    let url = `/api/v1/logout`;
    try {
        await axios.get(url);
        dispatch({
            type: LOGOUT_SUCCESS,
        })

    } catch (error) {
        dispatch({
            type: LOGOUT_FAIL,
            payload: error.response.data.message
        });
    }
}

export const updateProfile = (userData) => async (dispatch) => {
    let url = `/api/v1/me/update`
    try {
        dispatch({type: UPDATE_PROFILE_REQUEST});
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        const {data} = await axios.put(url, userData, config);

        dispatch({
            type: UPDATE_PROFILE_SUCCESS,
            payload: data.user
        })

    } catch (error) {
        dispatch({
            type: UPDATE_PROFILE_FAIL,
            payload: error.response.data.message
        });
    }
}


export const updatePassword = (passwords) => async (dispatch) => {
    let url = `/api/v1/password/update`
    try {
        dispatch({type: UPDATE_PASSWORD_REQUEST});
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const {data} = await axios.put(url, passwords, config);

        dispatch({
            type: UPDATE_PASSWORD_SUCCESS,
            payload: data.user
        })

    } catch (error) {
        dispatch({
            type: UPDATE_PASSWORD_FAIL,
            payload: error.response.data.message
        });
    }
}

export const forgotPassword = (email) => async (dispatch) => {
    let url = `/api/v1/password/forget`
    try {
        dispatch({type: FORGOT_PASSWORD_REQUEST});
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const {data} = await axios.post(url, email, config);

        dispatch({
            type: FORGOT_PASSWORD_SUCCESS,
            payload: data.message
        })

    } catch (error) {
        dispatch({
            type: FORGOT_PASSWORD_FAIL,
            payload: error.response.data.message
        });
    }
}

export const resetPassword = (token, passwords) => async (dispatch) => {
    let url = `/api/v1/password/reset/${token}`
    try {
        dispatch({type: NEW_PASSWORD_REQUEST});
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const {data} = await axios.put(url, passwords, config);

        dispatch({
            type: NEW_PASSWORD_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: NEW_PASSWORD_FAIL,
            payload: error.response.data.message
        });
    }
}


export const allUsers = () => async (dispatch) => {
    try {

        dispatch({type: ALL_USERS_REQUEST})

        const {data} = await axios.get('/api/v1/admin/users')

        dispatch({
            type: ALL_USERS_SUCCESS,
            payload: data.users
        })

    } catch (error) {
        dispatch({
            type: ALL_USERS_FAIL,
            payload: error.response.data.message
        })
    }
}

export const updateUser = (id, userData) => async (dispatch) => {
    try {

        dispatch({type: UPDATE_USER_REQUEST})

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const {data} = await axios.put(`/api/v1/admin/user/${id}`, userData, config)

        dispatch({
            type: UPDATE_USER_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: UPDATE_USER_FAIL,
            payload: error.response.data.message
        })
    }
}

export const getUserDetails = (id) => async (dispatch) => {
    try {

        dispatch({type: USER_DETAILS_REQUEST})


        const {data} = await axios.get(`/api/v1/admin/user/${id}`)

        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload: data.user
        })

    } catch (error) {
        dispatch({
            type: USER_DETAILS_FAIL,
            payload: error.response.data.message
        })
    }
}

export const deleteUser = (id) => async (dispatch) => {
    try {

        dispatch({ type: DELETE_USER_REQUEST })

        const { data } = await axios.delete(`/api/v1/admin/user/${id}`)

        dispatch({
            type: DELETE_USER_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: DELETE_USER_FAIL,
            payload: error.response.data.message
        })
    }
}



// Clear Errors
export const clearErrors = async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    })
}