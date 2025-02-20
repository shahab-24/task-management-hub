
import axios from 'axios'

const API_URL = "http://localhost:5000/tasks" 



// tasks creating funtion 
export const createTask = async (task) => {
        const res = await axios.post(API_URL, task)
        return res.data
}


export const getTask = async() => {
const res = await axios.get(API_URL)
return res.data 
}