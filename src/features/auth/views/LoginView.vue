<template>
    <BaseCard width="20rem">
        <h1 class="text-center mb-3">Login</h1>
        <LoginForm @submit="handleLogin" />
    </BaseCard>
</template>


<script setup>
import BaseCard from '@/shared/components/ui/BaseCard.vue';
import LoginForm from '../forms/LoginForm.vue';
import { useAuthStore } from '../authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogin = async (payload) => {
    try {
        const response = await authStore.login(payload);
        if (response) {
            router.push('/');
        } else {
            console.error('Login failed');
        }
    } catch (error) {
        console.error('Login failed', error);
    }
}
</script>