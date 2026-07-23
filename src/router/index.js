import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import LoginView from "../features/auth/views/LoginView.vue";
import RegistrationView from "../features/auth/views/RegistrationView.vue";
import NotFoundView from "@/views/NotFoundView.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            component: HomeView,
            meta: {
                requiresAuth: false,
            }
        },
        {
            path: "/login",
            component: LoginView,
            meta: {
                requiresAuth: false,
            }
        },
        {
            path: "/register",
            component: RegistrationView,
            meta: {
                requiresAuth: false,
            }
        },
        {
            path: '/:notFound(.*)',
            component: NotFoundView,
            meta: {
                requiresAuth: false,
            }
        }
    ]
});

export default router;
