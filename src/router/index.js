import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../features/home/views/HomeView.vue";
import LoginView from "../features/auth/views/LoginView.vue";
import RegistrationView from "../features/auth/views/RegistrationView.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            component: HomeView
        },
        {
            path: "/login",
            component: LoginView
        },
        {
            path: "/register",
            component: RegistrationView
        },
    ]
});

export default router;
