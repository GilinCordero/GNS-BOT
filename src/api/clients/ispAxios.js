import axios from 'axios';


const ispAxios = axios.create({
    baseURL: process.env.ISP_API_BASE_URL,
    auth: {
        username: process.env.ISP_API_USERNAME,
        password: process.env.ISP_API_PASSWORD
    },
    headers: {
        accept: 'application/json'
    },
    timeout: 5000
})

axios
  .request(options)
  .then(res => console.log(res.data))   
  .catch(err => console.error(err));