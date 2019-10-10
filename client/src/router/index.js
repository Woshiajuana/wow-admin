
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

];

const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
});

const router = createRouter();
let asyncRouter = null;

export function resetRouter() {
    const newRouter = createRouter();
    asyncRouter = null;
    router.options.routes = [...constantRoutes];
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
    let {
        $modal,
    } = Vue.prototype;
    let {
        access_token,
    } = objUserInfo || {};
    if (!asyncRouter && objUserInfo.group) {
        loadAsyncRouter(objUserInfo.group.menu_routes);
        return next({ ...to, replace: true });
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
    routes = JSON.parse(JSON.stringify(routes));
    asyncRouter = routes.filter((item) => {
        let { path, component, icon, title, father, redirect } = item;
        item.path = father ? path : `/${path}`;
        item.meta = { title, icon };
        if (!redirect) delete item.redirect;
        else item.redirect = `/${redirect}`;
        item.component = component.toLocaleLowerCase() === 'layout' ? Layout : () => import(`@/views/${component}`);
        return !item.father;
    });
    routes.forEach((item, index) => {
        let { path, component, icon, title, father } = item;
        if (father) {
            const fRouter = asyncRouter.filter((item) => item._id === father)[0];
            fRouter.children
                ? fRouter.children.push(item)
                : fRouter.children = [item];
        }
    });
    asyncRouter.push(route404);
    router.addRoutes(asyncRouter);
    router.options.routes = [ ...router.options.routes, ...asyncRouter ];
}

export default router;
