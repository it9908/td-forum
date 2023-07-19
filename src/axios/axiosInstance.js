// axiosInstance.js

import axios from 'axios';

const token = localStorage.getItem('token');

const axiosInstance = axios.create({
    baseURL: '/api', // 设置为相对路径
    headers: {
        common: {
            'Authorization': token
        }
    }
});

export default axiosInstance;
