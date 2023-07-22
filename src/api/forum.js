import api from '@/utils/request'

// 获取首页列表
export function getPosts(){
    return api({
        url:"/v1/homePage/postsList",
        method:"GET"
    })
}

// 获取全部帖子列表
export function getPostsList(){
    return api({
        url:"/v1/getPostList",
        method:"GET"
    })
}

