import axios from 'axios'

const Api = axios.create({
    baseURL: import.meta.env.WHEATHER_URL,
    
})

export default Api;