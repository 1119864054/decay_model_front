import {createStore} from 'vuex'

export default createStore({
    state: {
        result: null
    },
    getters: {
        getResult: state => {
            return state.result;
        },
    },
    mutations: {
        setResult(state, result) {
            state.result = result;
        }
    },
    actions: {},
    modules: {}
})
