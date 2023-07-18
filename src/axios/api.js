import axios from 'axios';

// 创建一个 Axios 实例
const api = axios.create({
  //   baseURL: 'http://localhost:5000',
  timeout: 5000,
});

// 添加请求拦截器
api.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    // 可以设置请求头、添加身份验证信息等
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
api.interceptors.response.use(
  function (response) {
    // 对响应数据做些什么
    return response.data;
  },
  function (error) {
    // 对响应错误做些什么
    return Promise.reject(error);
  }
);

// 封装具体的请求方法
export const get = url => api.get(url);
export const post = (url, data, token = null) => {
  const config = {};

  if (token) {
    config.headers = {
      Authorization: token
    };
  }

  return axios.post(url, data, config);
};
