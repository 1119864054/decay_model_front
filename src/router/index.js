import {createRouter, createWebHistory} from "vue-router";
import Home from "../views/Home.vue";
import Result from "../views/Result.vue";
import Main from "../views/Main.vue";

const routes = [
    {
        path: "/",
        name: "Main",
        component: Main,
        children: [
            {
                path: "/home",
                name: "Home",
                component: Home
            },
            {
                path: "/result",
                name: "Result",
                component: Result
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;
