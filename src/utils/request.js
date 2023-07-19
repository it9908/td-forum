import axios from 'axios';

// 创建一个 Axios 实例
const api = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 5000,    // 
  headers: {
    'Content-Type': 'application/json'
  }
});

// 添加请求拦截器
api.interceptors.request.use(
  config => {
    // console.log(config);
    // 在请求发送前进行一些处理
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // 可以添加认证信息、请求参数的处理等
    return config;
  },
  error => {
    // 处理请求错误
    return Promise.reject(error);
  }
);

// 添加响应拦截器
api.interceptors.response.use(
  response => {
    // 在接收到响应后进行一些处理
    // 可以处理响应数据、错误状态码等
    return response;
  },
  error => {
    // 处理响应错误
    return Promise.reject(error);
  }
);

export default api;
