import Vue from 'vue'
import Vuex from 'vuex'
import userData from '@/store/reqIsAutch'

Vue.use(Vuex)

//创建暴露store
export default new Vuex.Store({
    modules: {  
        userData
    }
})