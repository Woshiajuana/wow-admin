
import Vue from 'vue'
import Router from 'vue-router'
import store from '@store'
import Layout from '@layout'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
NProgress.configure({ showSpinner: false });

Vue.use(Router);

export const constantRoutes = [

    {
        path: '/login',
        component: () => import('@views/login'),
        hidden: true,
    },

    {
        path: '/setup',
        component: () => import('@views/setup'),
        hidden: true,
    },

    {
        path: '/404',
        component: () => import('@views/404'),
        hidden: true,
    },

    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [{
            path: 'dashboard',
            name: 'Dashboard',
            component: () => import('@views/dashboard'),
            meta: { title: 'Dashboard', icon: 'dashboard' }
        }],
    },

    {
        path: '/admin',
        component: Layout,
        redirect: '/admin/user',
        name: 'Admin',
        meta: { title: '管理员用户管理', icon: 'user' },
        children: [
            {
                path: 'user',
                name: 'User',
                component: () => import('@views/admin/user'),
                meta: { title: '管理员列表', icon: 'table' },
            },
            {
                path: 'group',
                name: 'Group',
                component: () => import('@views/admin/group'),
                meta: { title: '用户组列表', icon: 'table' },
            },
            {
                path: 'menu',
                name: 'Menu',
                component: () => import('@views/admin/menu'),
                meta: { title: '菜单列表', icon: 'table' },
            },
            {
                path: 'api',
                name: 'Api',
                component: () => import('@views/admin/api'),
                meta: { title: 'API列表', icon: 'table' },
            },
        ],
    },

    {
        path: '*',
        redirect: '/404',
        hidden: true,
    },

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
    NProgress.start();
    let {
        objAppInfo,
        objUserInfo,
    } = store.getters;
    let {
        path: toPath,
    } = to;
    let {
        path: fromPath,
    } = from;
    if (!objUserInfo)
        objUserInfo = await store.dispatch('user/getInfo');
    console.log('objUserInfo => ', objUserInfo);
    let {
        $modal,
    } = Vue.prototype;
    let {
        access_token,
    } = objUserInfo || {};
    if (objUserInfo) {
        loadAsyncRouter(objUserInfo.group.menu_routes);
    }
    if (toPath === '/404') {
        next();
    } else if (objAppInfo) {
        if (toPath === '/setup') {
            next('/');
        } else {
            if (access_token) {
                toPath === '/login' ? next('/') : next()
            } else {
                toPath === '/login' ? next() : next(`/login?redirect=${to.path}`)
            }
        }
    } else {
        try {
            await store.dispatch('app/getInfo');
            if (toPath === '/setup') {
                next('/');
            } else {
                if (access_token) {
                    toPath === '/login' ? next('/') : next()
                } else {
                    toPath === '/login' ? next() : next(`/login?redirect=${to.path}`)
                }
            }
        } catch (e) {
            $modal.toast(e, 'error');
            if (e.code === 'F00001') {
                toPath === '/setup' ? next() : next(`/setup?redirect=${toPath}`);
            } else {
                next('/404');
            }
        }
    }
    NProgress.done();
});

router.afterEach(() => {
    NProgress.done();
});

function loadAsyncRouter (routes) {
    const asyncRouter = routes.filter((item) => item.father);
    routes.forEach((item, index) => {
        let { path, component, icon, title, father } = item;
        if (father) {
            const fRouter = asyncRouter.filter((item) => item._id === father);
            fRouter.children
                ? fRouter.children.push(item)
                : fRouter.children = [item];
        }
    });

    // const asyncRouter = routes.filter(route => {
    //     if (route.component) {
    //     if (route.component === 'Layout') {//Layout组件特殊处理
    //             route.component = Layout
    //         } else {
    //             route.component = _import(route.component)
    //         }
    //     }
    //     if (route.children && route.children.length) {
    //         route.children = filterAsyncRouter(route.children)
    //     }
    //     return true;
    // });
    console.log('asyncRouter => ', asyncRouter);

    return asyncRouter
}

export default router;
