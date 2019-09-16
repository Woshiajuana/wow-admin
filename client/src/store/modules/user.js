import { resetRouter } from '@/router'
import Vue from 'vue'
import storage from '@utils/storage'

const state = {
    objUserInfo: '',
};

const mutations = {
    SET_USER_INFO: (state, objUserInfo) => {
        state.objUserInfo = Object.assign({}, state.objUserInfo, objUserInfo);
    },
};

const actions = {

    login({ commit }, userInfo) {
        const { username, password } = userInfo;
        return new Promise((resolve, reject) => {

        })
    },

    // get user info
    getInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            let objUserInfo = storage.cache.get('USER_INFO');
            if (objUserInfo) {
                commit('SET_USER_INFO', objUserInfo);
            }
            resolve(objUserInfo);
        })
    },

    // user logout
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
            logout(state.token).then(() => {
                commit('SET_TOKEN', '')
                removeToken()
                resetRouter()
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // remove token
    resetToken({ commit }) {
        return new Promise(resolve => {
            commit('SET_TOKEN', '')
            removeToken()
            resolve()
        })
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
}

