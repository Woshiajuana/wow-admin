
import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@layout'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
NProgress.configure({ showSpinner: false });

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

const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
});

const router = createRouter();

export function resetRouter() {
    const newRouter = createRouter();
    router.matcher = newRouter.matcher; // reset router
}

router.beforeEach(async(to, from, next) => {
    // start progress bar
    NProgress.start();
    next();
    NProgress.done();
});

router.afterEach(() => {
    // finish progress bar
    NProgress.done()
});


export default router;
