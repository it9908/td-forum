import api from '@/utils/request'

// 用户注册
export function register(data) {
    return api({
        url: '/v1/logon',
        method: 'POST',
        data
    })
}

// 用户登录
export function login(data) {
    return api({
        url: '/v1/login',
        method: 'POST',
        data
    })
}

// 获取用户信息
export function infoUser() {
    return api({
        url: '/v1/current/userinfo',
        method: 'GET',
    })
}