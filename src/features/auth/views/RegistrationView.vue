<template>
    <base-card width="28rem">
        <h1 class="text-center mb-3">Register new account</h1>
        <RegistrationForm @submit-form="handleRegistration" />
    </base-card>
</template>

<script setup>
import RegistrationForm from '../forms/RegistrationForm.vue';   
import { useAuthStore } from '../authStore';
import { useUserStore } from '../../users/userStore.js';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const userStore = useUserStore();
const router = useRouter();

const handleRegistration = async (payload, image) => {
    try {
        const userData = await authStore.register(payload);
        if (userData) {
            if (image && userData.id) {
                try {
                    await userStore.uploadProfileImage(image, userData.id);    
                } catch (error) {
                    console.error(error);
                }
            }
            router.push('/');
        } else {
            console.error('Data upload failed');
        }
    } catch (error) {
        console.error('Registration failed', error);
    }
}
</script>
