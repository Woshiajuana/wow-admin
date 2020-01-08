
import Vue from 'vue'
import Router from 'vue-router'
import store from '@store'
import Layout from '@layout'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
NProgress.configure({ showSpinner: false });

Vue.use(Router);

const route404 = {
    path: '*',
    redirect: '/404',
    hidden: true,
};

let constantRoutes = [

    {
        path: '/login',
        component: () => import('@views/login'),
        hidden: true,
        meta: { title: '登录' }
    },

    {
        path: '/setup',
        component: () => import('@views/setup'),
        hidden: true,
        meta: { title: '设置' }
    },

    {
        path: '/404',
        component: () => import('@views/404'),
        hidden: true,
        meta: { title: '404' }
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
        path: '/menu',
        component: Layout,
        redirect: '/menu/menu1/menu1-1',
        meta: { title: '测试菜单', icon: 'table' },
        children: [
            {
                path: 'menu1',
                redirect: '/menu/menu1/menu1-1',
                component: () => import('@views/menu/menu1'),
                meta: { title: 'menu1' },
                children: [
                    {
                        path: 'menu1-1',
                        component: () => import('@views/menu/menu1/menu1-1'),
                        meta: { title: 'menu1-1' }
                    },
                    {
                        path: 'menu1-2',
                        component: () => import('@views/menu/menu1/menu1-2'),
                        meta: { title: 'menu1-2' }
                    },
                    {
                        path: 'menu1-3',
                        hidden: true,
                        component: () => import('@views/menu/menu1/menu1-3'),
                        meta: { title: 'menu1-3' }
                    }
                ],
            },
            {
                path: 'menu2',
                component: () => import('@views/menu/menu2'),
                meta: { title: '测试一级菜单2' }
            }
        ],
    },

];

const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
});

let router;
let asyncRoutes = null;
let objRouter = {};

export function resetRouter() {
    const newRouter = createRouter();
    asyncRoutes = null;
    router.options.routes = [...constantRoutes];
    router.matcher = newRouter.matcher; // reset router
}

function loadAsyncRoutes (routes) {
    routes = JSON.parse(JSON.stringify(routes));
    asyncRoutes = routes.filter((item) => {
        let { path, component, icon, title, father, redirect } = item;
        item.path = father ? path : `/${path}`;
        item.meta = { title, icon };
        if (!redirect) delete item.redirect;
        else item.redirect = `/${redirect}`;
        item.component = component.toLocaleLowerCase() === 'layout' ? Layout : objRouter[component.replace('/index', '')] ? objRouter[component.replace('/index', '')] : () => import(`@/views/${component}`);
        return !item.father;
    });
    routes.forEach((item, index) => {
        let { path, component, icon, title, father } = item;
        if (father) {
            const fRouter = asyncRoutes.filter((item) => item._id === father)[0];
            fRouter.children ? fRouter.children.push(item) : fRouter.children = [item];
        }
    });
    asyncRoutes.push(route404);
    router.addRoutes(asyncRoutes);
    router.options.routes = [ ...router.options.routes, ...asyncRoutes ];
    // console.log('router.options.routes => ', router.options.routes);
}

// 创建导航守卫
function initNavigationGuard() {
    router.beforeEach(async(to, from, next) => {
        NProgress.start();
        let {
            objAppInfo = '',
            objUserInfo = '',
        } = store.getters;
        let {
            path: toPath,
        } = to;
        let {
            path: fromPath,
        } = from;
        if (!objUserInfo)
            objUserInfo = await store.dispatch('user/getInfo');
        let {
            $modal,
        } = Vue.prototype;
        let {
            access_token,
        } = objUserInfo || {};

        if (!asyncRoutes && objUserInfo && objUserInfo.group) {
            loadAsyncRoutes(objUserInfo.group.menu_routes);
            console.log('to => ', to);
            console.log('from => ', from);
            return next({ ...to, replace: true });
            // return next();
        }
        window.document.title = `${objAppInfo.name ? objAppInfo.name + ' ' : ''}${to.meta.title || ''}`;
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
}

export default (views, routes) => {
    // 初始化路由
    if (!router) {
        // 注入新页面
        if (views)
            objRouter = views;
        // 注入初始导航
        if (routes) {
            if (typeof routes === 'function')
                routes = routes({ Layout });
            constantRoutes.forEach((item, index) => {
                routes.forEach((route) => {
                    if (item.path === route.path) {
                        constantRoutes[index] = route;
                    }
                });
            });
        }
        // 创建路由
        router = createRouter();
        // 创建导航守卫
        initNavigationGuard();
    }
    return router;
};
