
import Vue from 'vue'

import 'normalize.css/normalize.css'; // A modern alternative to CSS resets

import ElementUI                            from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale                               from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import _                                    from 'lodash'

import App                                  from '@/App.vue'
import store                                from '@store'
import generateRouter                       from '@router'

import '@assets/scss/index.scss'
import '@assets/icons' // icon
import '@utils/promise'

import http                                 from '@utils/http'
import modal                                from '@utils/modal'
import storage                              from '@utils/storage'
import verify                               from '@utils/verify'
import regular                              from '@utils/regular'

Vue.use(ElementUI, { locale });
Vue.config.productionTip = false;

const componentFiles = require.context('./components', true, /index\.vue$/); // 不支持变量传路径
let router = null;

const DEFAULT_OPTIONS = {
    // 扩展类配置, 这个类里面的数据都会扩展挂载到 VUE 上
    extendUtils: {
        $modal: modal,
        $storage: storage,
        $verify: verify,
        $regular: regular,
    },
    // API配置
    httpRequest: {
        baseURL: '',
        timeout: 30000,
        method: 'POST',
        callbackSuccess: response => response,
        callbackError: () => {},
    },
    // app 常量配置
    appConst: {
        // 查询 APPINFO
        _REQ_APP_INFO: 'api/v1/app/info',
        // 设置 APPINFO
        _DO_APP_INIT: 'api/v1/app/init',
        // 管理员用户登录
        _DO_USER_LOGIN: 'api/v1/user-info/login',
        // 管理员用户安全退出
        _DO_USER_LOGOUT: 'api/v1/user-info/logout',

        // 查询管理员用户列表
        _REQ_USER_LIST: 'api/v1/user-info/list',
        // 解锁管理员账号
        _DO_UNLOCK_USER_INFO: 'api/v1/user-info/unlock',
        // 禁用启用管理员账号
        _DO_DISABLED_USER_INFO: 'api/v1/user-info/disable-enable',
        // 创建管理员用户
        _DO_CREATE_USER_INFO: 'api/v1/user-info/create',
        // 编辑管理员用户
        _DO_UPDATE_USER_INFO: 'api/v1/user-info/update',
        // 删除管理员用户
        _DO_DELETE_USER_INFO: 'api/v1/user-info/delete',

        // 修改个人信息
        _DO_CHANGE_USER_CENTER_INFO: 'api/v1/user-info/change',


        // 查询管理元用户组列表
        _REQ_USER_GROUP_LIST: 'api/v1/user-group/list',
        // 创建用户组
        _DO_CREATE_USER_GROUP: 'api/v1/user-group/create',
        // 编辑用户组
        _DO_UPDATE_USER_GROUP: 'api/v1/user-group/update',
        // 删除用户组
        _DO_DELETE_USER_GROUP: 'api/v1/user-group/delete',

        // 查询API路由列表
        _REQ_API_ROUTE_LIST: 'api/v1/api-route/list',
        // 初始化路由列表
        _DO_INIT_API_ROUTE: 'api/v1/api-route/init',
        // 创建API路由
        _DO_CREATE_API_ROUTE: 'api/v1/api-route/create',
        // 更新API路由
        _DO_UPDATE_API_ROUTE: 'api/v1/api-route/update',
        // 删除API路由
        _DO_DELETE_API_ROUTE: 'api/v1/api-route/delete',

        // 查询菜单路由列表
        _REQ_MENU_ROUTE_LIST: 'api/v1/menu-route/list',
        // 创建菜单路由
        _DO_CREATE_MENU_ROUTE: 'api/v1/menu-route/create',
        // 更新菜单路由
        _DO_UPDATE_MENU_ROUTE: 'api/v1/menu-route/update',
        // 删除菜单路由
        _DO_DELETE_MENU_ROUTE: 'api/v1/menu-route/delete',

        // 查询操作日志列表
        _REQ_OPLOG_LIST: 'api/v1/oplog/list',
        // 删除操作日志
        _DO_DELETE_OPLOG: 'api/v1/oplog/delete',
    },
    // 组件配置
    component: {
        importComponents: [
            componentFiles,
        ],
    },
    // 路由配置
    routerConfig: {
        importViews: [],
    },
};

window.wowRuntime = {
    app: null, // app
    wow: {}, // 总体工具类
    options: {},
    init (options = {}) {
        this.options = _.mergeWith({}, DEFAULT_OPTIONS, options, (objValue, srcValue) =>  {
            if (_.isArray(objValue)) { return objValue.concat(srcValue); }
        });
        this._handleInitExtend();
        this._handleInitHttp();
        this._handleInitConst();
        this._handleInitComponent();
        this._handleInitRouter();
        this._handleMountVue();
        this._handleInitApp();
        window.wow = this.wow;
        return { app: this.app, wow: this.wow};
    },
    getOptions () {
        return this.options;
    },
    getDefaultOptions () {
        return DEFAULT_OPTIONS;
    },
    _handleInitRouter () {
        let { routerConfig } = this.options;
        let { importViews, constantRoutes } = routerConfig;
        let objViews = {};
        importViews.forEach((viewsFiles) => {
            viewsFiles.keys().forEach((key) => {
                let strName = key.substring(2, key.indexOf('/index.vue'));
                objViews[strName] = viewsFiles(key).default || viewsFiles(key);
            });
        });
        router = generateRouter(objViews, constantRoutes);
    },
    _handleInitComponent () {
        let { component } = this.options;
        let { importComponents } = component;
        delete component.importComponents;
        importComponents.forEach((componentFiles) => {
            componentFiles.keys().forEach((key) => {
                let strName = key.substring(2, key.indexOf('/index.vue'));
                Vue.component(strName, componentFiles(key).default || componentFiles(key));
            });
        });
        _.forEach(component, (item, key) => {
            Vue.component(key, item(key).default || item(key));
        })
    },
    _handleMountVue () {
        Object.assign(Vue.prototype, this.wow);
        return this;
    },
    _handleInitApp () {
        this.app = new Vue({
            store,
            router,
            render: h => h(App),
        }).$mount('#app');
        return this;
    },
    _handleInitConst () {
        let { appConst } = this.options;
        this.wow.$appConst = appConst;
        return this;
    },
    _handleInitHttp () {
        let { httpRequest } = this.options;
        this.wow.$curl = http(httpRequest);
        return this;
    },
    _handleInitExtend () {
        let { extendUtils } = this.options;
        _.forEach(extendUtils, (item, key) => this._use(key, item));
        return this;
    },
    _use (key, value) {
        (key.indexOf('$') === -1) && (key = `${key}`);
        value && (this.wow[key] = value);
        return this;
    },
};


let { wow, app } = window.wowRuntime.init({
    // 扩展类配置, 这个类里面的数据都会扩展挂载到 VUE 上
    extendUtils: {

    },
    // API配置
    httpRequest: {
        baseURL: `${window.location.protocol}//${window.location.hostname}:7001/`,
        timeout: 30 * 1000,
    },
    // app 常量配置
    appConst: {

    },
    // 路由配置
    routerConfig: {
        // 固定路由
        constantRoutes: ({ Layout }) => {
            return [
                {
                    path: '/',
                    component: Layout,
                    redirect: '/dashboard',
                    children: [{
                        path: 'dashboard',
                        name: 'Dashboard',
                        component: () => import('@views/home'),
                        meta: { title: 'Dashboard', icon: 'dashboard' }
                    }],
                },
            ]
        },
    },
    // 组件配置
    component: {
        importComponents: [ ],
    },
});

console.log(wow);
