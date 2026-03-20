import axios from 'axios'

const request = axios.create({
  baseURL: 'http://localhost:8123/api',
  timeout: 10000
})

// Request interceptor
request.interceptors.request.use(
  config => {
    // You can add headers here, e.g., authorization token
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Response interceptor
request.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    return Promise.reject(error)
  }
)

export default request
