import { createSlice } from "@reduxjs/toolkit";
import { API } from "../http/index";

const STATUSES = Object.freeze({
    IDLE: "idle",
    ERROR: "error",
    LOADING: "loading",
    SUCCESS: "success",
})

const authSlice = createSlice({
    name: "auth",

    initialState: {
        data: JSON.parse(localStorage.getItem('user')) || [],
        // data: [],  
        status: STATUSES.IDLE,
        token: localStorage.getItem('token') || "",
        isAuthenticated: !!localStorage.getItem('token'),
        error: null,
    },

    reducers: {
        setUser(state, action) {
            state.data = action.payload
            state.isAuthenticated = true
            localStorage.setItem('user', JSON.stringify(action.payload))
        },

        setStatus(state, action) {
            state.status = action.payload
        },

        setError(state, action) {
            state.error = action.payload
        },

        setToken(state, action) {
            state.token = action.payload
            if (action.payload) {
                state.isAuthenticated = true
            }
        },

        logOut(state) {
            state.data = []
            state.token = ""
            state.isAuthenticated = false
            state.error = null
            state.status = STATUSES.IDLE
            localStorage.removeItem('token')
        },

        clearError(state) {
            state.error = null
        },
    }
})

export const { setUser, setStatus, setToken, logOut, clearError, setError } = authSlice.actions

export default authSlice.reducer

//register user
export function registerUser(data) {
    return async function registerUserThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING))
        dispatch(clearError())
        
        // Validate input - updated to match form fields
        if (!data.name || !data.email ||!data.role || !data.password) {
            const errorMessage = "All fields are required"
            dispatch(setError(errorMessage))
            dispatch(setStatus(STATUSES.ERROR))
            return { success: false, error: errorMessage }
        }

        try {
            const response = await API.post("/auth/register", data)
            
            if (response && response.status === 201 && response.data) {
                if (response.data.data) {
                    dispatch(setUser(response.data.data))
                }
                dispatch(setStatus(STATUSES.SUCCESS))
                return { success: true, data: response.data }
            } else {
                const errorMessage = response.data?.message || "Registration failed. Invalid response from server."
                dispatch(setError(errorMessage))
                dispatch(setStatus(STATUSES.ERROR))
                return { success: false, error: errorMessage }
            }

        } catch (e) {
            console.error('registerUser error:', e)
            let errorMessage = "Registration failed"
            
            if (e.response) {
                console.error('server response:', e.response.status, e.response.data)
                errorMessage = e.response.data?.message || e.response.data?.error || "Registration failed. Please check your information."
            } else if (e.request) {
                console.error('no response received:', e.request)
                errorMessage = "No response from server. Please check your connection."
            } else {
                errorMessage = e.message || "An error occurred during registration"
            }
        
            dispatch(setError(errorMessage))
            dispatch(setStatus(STATUSES.ERROR))
            return { success: false, error: errorMessage }
        }
    }
}

//for login
export function loginUser(data) {
    return async function loginUserThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING))
        dispatch(clearError())
        
        if (!data.email || !data.password) {
            const errorMessage = "Email and password are required"
            dispatch(setError(errorMessage))
            dispatch(setStatus(STATUSES.ERROR))
            return { success: false, error: errorMessage }
        }
        
        try {
            const response = await API.post("/auth/login", data)
            
            if (response && response.status === 200 && response.data && response.data.token) {
                localStorage.setItem('token', response.data.token)
                dispatch(setUser(response.data.data))
                dispatch(setToken(response.data.token))
                dispatch(setStatus(STATUSES.SUCCESS))
                return { success: true, data: response.data }
            } else {
                const errorMessage = response.data?.message || "Login failed. Invalid response from server."
                dispatch(setError(errorMessage))
                dispatch(setStatus(STATUSES.ERROR))
                return { success: false, error: errorMessage }
            }
        } catch (error) {
            console.error('Login error:', error)
            let errorMessage = "Something went wrong"
            
            if (error.response) {
                errorMessage = error.response.data?.message || error.response.data?.error || "Login failed. Please check your credentials."
                console.error('Server error:', error.response.status, error.response.data)
            } else if (error.request) {
                errorMessage = "No response from server. Please check your connection."
                console.error('No response:', error.request)
            } else {
                errorMessage = error.message || "An error occurred during login"
            }
            
            dispatch(setError(errorMessage))
            dispatch(setStatus(STATUSES.ERROR))
            return { success: false, error: errorMessage }
        }
    }
}