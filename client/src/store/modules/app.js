import Cookies from 'js-cookie'
import Vue from 'vue'
import storage from '@utils/storage'

const defBg = require('@assets/images/bg.jpg');
const defLogo = require('@assets/images/logo.png');

const state = {
    sidebar: {
        opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
        withoutAnimation: false,
    },
    device: 'desktop',
    objAppInfo: '',
    objDefAppInfo: {
        name: 'Wow-Admin',
        logo: defLogo,
        bg: defBg,
        defLogo: defLogo,
        defBg: defBg,
        deColor: 'rgba(0, 0, 0, .5)',
        color: 'rgba(0, 0, 0, .5)',
        ownership: 'Copyright ©2019 Ajuan. All Rights Reserved.',
    },
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
    SET_APP_INFO: (state, objAppInfo) => {
        state.objAppInfo = objAppInfo;
        storage.cache.set('APP_INFO', objAppInfo);
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

    getInfo ({ commit, state }) {
        return new Promise((resolve, reject) => {
            let objAppInfo = storage.cache.get('APP_INFO');
            if (objAppInfo) {
                commit('SET_APP_INFO', objAppInfo);
                return resolve(objAppInfo);
            }
            let { $curl, $appConst } = Vue.prototype;
            $curl($appConst.REQ_APP_INFO).then((res) => {
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
