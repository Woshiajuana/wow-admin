import Cookies from 'js-cookie'
import Vue from 'vue'
import storage from '@utils/storage'

const state = {
    sidebar: {
        opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
        withoutAnimation: false,
    },
    device: 'desktop',
    appInfo: '1',
};

const mutations = {
    TOGGLE_SIDEBAR: state => {
        state.sidebar.opened = !state.sidebar.opened;
        state.sidebar.withoutAnimation = false;
        if (state.sidebar.opened) {
            Cookies.set('sidebarStatus', 1)
        } else {
            Cookies.set('sidebarStatus', 0)
        }
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
        Cookies.set('sidebarStatus', 0);
        state.sidebar.opened = false;
        state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => state.device = device,
    SET_APP_INFO: (state, appInfo) => {
        state.appInfo = appInfo;
        storage.cache.set('APP_INFO', appInfo);
    },
};

const actions = {
    toggleSideBar({ commit }) {
        commit('TOGGLE_SIDEBAR')
    },
    closeSideBar({ commit }, { withoutAnimation }) {
        commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    toggleDevice({ commit }, device) {
        commit('TOGGLE_DEVICE', device)
    },

    getAppInfo ({ commit, state }) {
        return new Promise((resolve, reject) => {
            let appInfo = storage.cache.get('APP_INFO');
            if (appInfo) {
                commit('SET_APP_INFO', appInfo);
                return resolve(appInfo);
            }
            let { $curl, $appConst } = Vue.prototype;
            $curl($appConst.REQ_APP_GET).then((res) => {
                commit('SET_APP_INFO', res);
                resolve(res);
            }).catch((err) => {
                reject(err);
            })
        });
    },

};

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
