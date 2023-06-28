import Vue from 'vue'
// import store from '../store/index'
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
            component: () => import('@/components/HomePage.vue'),
            children: [
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
            redirect:'/forum/postslist',
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
                    path: 'mycomment',
                    name: "MyComment",
                    component: () => import('@/components/MyComment.vue')
                },
            ]
        },
        {
            path: '/console',
            name: "Console",
            component: () => import('@/components/AdminConsole.vue'),
            meta: {
                requiresAuth: true
            }
        }
    ]
})

// router.beforeEach((to, from, next) => {
//     console.log(to, from);
//     console.log(store.getters['userData/getUserInfo'].identity);
//     // 判断目标路由是否需要进行权限验证
//     if (to.meta.requiresAuth) {
//     } else {
//         // 不需要权限验证的路由，直接通过
//         next();
//     }
// });


export default router