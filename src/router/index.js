import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: '/',
            component: () => import('@/components/HomePage.vue')
        },
        {
            path: '/home',
            name: "Home",
            redirect: '/home/homes',
            component: () => import('@/components/HomePage.vue'),
            children: [

                {
                    path: 'homes',
                    name: "Home",
                    component: () => import('@/components/HomesPage.vue')
                },
                {
                    path: 'login',
                    name: "Login",
                    component: () => import('@/components/LoginPage.vue')
                },
                {
                    path: 'logon',
                    name: "Logon",
                    component: () => import('@/components/LogonPage.vue')
                }
            ]
        },
        {
            path: '/forum',
            name: "Forum",
            component: () => import('@/components/MyForum.vue'),
            redirect: '/forum/postslist',
            children: [
                {
                    path: 'postslist',
                    name: "PostsList",
                    component: () => import('@/components/PostsList.vue')
                },
                {
                    path: 'myposts',
                    name: "MyPosts",
                    component: () => import('@/components/MyPosts.vue')
                },
                {
                    path: 'postdetail',
                    name: "PostDetail",
                    component: () => import('@/components/PostDetail.vue')
                },
            ]
        },
        {
            path: '/console1',
            name: 'Console',
            redirect: '/console/users',
            component: () => import('@/components/AdminConsole.vue'),
            meta: {
                requiresAuth: true
            },
            children: [
                {
                    path: 'users',
                    name: 'AdUsers',
                    component: () => import('@/components/console-components/AdUsers.vue')
                },
                {
                    path: 'posts',
                    name: 'AdPosts',
                    component: () => import('@/components/console-components/AdPosts.vue')
                },
                {
                    path: 'testposts',
                    name: '',
                    component: () => import('@/components/console-components/TestAdPosts.vue')
                }
            ]
        },
        {
            path: '/console',
            meta: {
                title: "首页",
            },
            component: () => import('@/views/ConsolePage.vue'),
            redirect: '/console/default',
            children: [
                {
                    path: 'default',
                    component: () => import('@/components/console-main/AdDefault.vue'),
                    meta: {
                        title: "默认",
                    },
                },
                {
                    path: 'home',
                    component: () => import('@/components/console-main/ConsolePosts.vue'),
                    meta: {
                        title: "帖子管理",
                    },
                },
                {
                    path: 'user',
                    component: () => import('@/components/console-main/ConsoleUser.vue'),
                    meta: {
                        title: "用户管理",
                    },
                },
                {
                    path: 'post',
                    component: () => import('@/components/console-main/AdPost.vue'),
                    meta: {
                        title: "发布",
                    },
                },
                {
                    path: 'toexamine',
                    component: () => import('@/components/console-main/ToExamine.vue'),
                    meta: {
                        title: "发布审核",
                    },
                },
                
            ]
        }
    ]
})

export default router