export default {
    namespaced: true,
    actions: {
        saveToken({ commit }, token) {
            commit('setToken', token);
        },
        saveUserInfo({ commit }, value) {
            commit('setUserInfo', value);
        }
    },
    mutations: {
        setToken(state, token) {
            state.token = token;
        },
        setUserInfo(state, value) {
            state.userInfo = value;
        }
    },
    
    getters: {
        getToken(state) {
            return state.token;
        },
        getUserInfo(state) {
            return state.userInfo;
        }
    },
    state: {
        token: null,
        userInfo:[]
    },
}