
import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@layout'

Vue.use(Router);

export const constantRoutes = [

    // {
    //     path: '/login',
    //     component: () => import('@views/login/index'),
    //     hidden: true,
    // },

    {
        path: '/404',
        component: () => import('@views/404'),
        hidden: true
    }

];
