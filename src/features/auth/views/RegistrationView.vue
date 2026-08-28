<template>
    <base-card width="28rem">
        <h1 class="text-center mb-3">Register new account</h1>
        <RegistrationForm @submit-form="handleRegistration" />
    </base-card>
</template>

<script setup>
import RegistrationForm from '../forms/RegistrationForm.vue';
import { useAuthStore } from '../authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleRegistration = async (payload, image) => {
    try {
        const userData = await authStore.register(payload, image);
        if (userData) {
            router.push('/');
        } else {
            console.error('Registration failed');
        }
    } catch (error) {
        console.error('Registration failed', error);
    }
}
</script>
