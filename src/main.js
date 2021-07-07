import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/lib/theme-chalk/index.css";
import "element-plus/lib/theme-chalk/display.css";
import App from "./App.vue";
import router from "./router";
import VueParticles from "vue-particles";
import store from './store'


createApp(App).use(store).use(router)
    .use(router)
    .use(ElementPlus)
    .use(VueParticles)
    .mount("#app");
