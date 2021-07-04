import {createRouter, createWebHistory} from 'vue-router'
import Home from '../views/Home.vue'
import Main from '../views/Main.vue'

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
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
