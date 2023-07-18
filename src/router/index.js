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
            path: '/console',
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
                }
            ]
        }
    ]
})

export default router