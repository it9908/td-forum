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
        url: "/test/release1",
        method: "POST",
        data,
    })
}

// 获取自己的帖子
export function ownPosts() {
    return api({
        url: "/v1/myposts",

    })
}

export function draftToBeReviewed(pageNumber, pageSize){
    return api({
        url: `/test/pendingReview/${pageNumber}/${pageSize}`,
        method:"GET"
    })
}