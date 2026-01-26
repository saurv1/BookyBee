import axios from "axios"

const API = axios.create({
    baseURL: "http://localhost:3001/api",
    headers:{
        "Content-Type":"application/json",
        Accept:"application/json"
    }
})

const APIAuthenticated= axios.create({
    baseURL:"http://localhost:3001/api",
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