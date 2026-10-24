import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import RegistrationView from "@/views/RegistrationView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import UserProfileView from "@/views/UserProfileView.vue";
import Users from "@/views/Users.vue";

import { validateUserProfileId } from './validation.js'


const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: 'dashboard',
            component: HomeView,
            meta: {
                requiresAuth: false,
            }
        },
        {
            path: "/login",
            name: "login",
            component: LoginView,
            meta: {
                requiresAuth: false,
            }
        },
        {
            path: "/register",
            name: "register-user",
            component: RegistrationView,
            meta: {
                requiresAuth: false,
            }
        },
        {
            path: '/user-profile/:id',
            name: "user-profile",
            component: UserProfileView,
            beforeEnter: validateUserProfileId,
            meta: {
                requiresAuth: true,
                requiresSelfOrAdmin: true,
            }
        },
        {
            path: '/:notFound(.*)',
            name: "not-found",
            component: NotFoundView,
            meta: {
                requiresAuth: false,
            }
        },
        {
            path: '/users',
            name: "users",
            component: Users,
            meta: {
                requiresAuth: true,
                requiresAdmin: true
            }
        }
    ]
});

export default router;
