import axios from "axios"

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3005/api"

const API = axios.create({
    baseURL: BASE_URL,
    headers:{
        "Content-Type":"application/json",
        Accept:"application/json"
    }
})

const APIAuthenticated= axios.create({
    baseURL: BASE_URL,
    headers:{
        "Content-Type":"application/json",
        Accept:"application/json"
    }
})


// Add request interceptor to include token dynamically
APIAuthenticated.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token")
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)



export {API, APIAuthenticated}