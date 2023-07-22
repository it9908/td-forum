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

// 发布
export function release(data) {
    return api({
        url: "/releasePosts",
        method: "POST",
        data,
        headers: {
            // "Content-Type": "multipart/form-data", // 覆盖拦截器中的Content-Type设置
        }
    })
}

// 获取自己的帖子
export function ownPosts() {
    return api({
        url: "/v1/myposts",

    })
}