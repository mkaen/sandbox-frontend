<template>
    <BaseCard width="28rem">
        <h1 class="text-center mb-3">Register new account</h1>
        <RegistrationForm @submit-form="handleRegistration" />
    </BaseCard>
</template>

<script setup>
import BaseCard from '@/shared/components/ui/BaseCard.vue';
import RegistrationForm from '../forms/RegistrationForm.vue';   
import { useAuthStore } from '../authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleRegistration = async (payload) => {
    try {
        const response = await authStore.register(payload);
        console.log('handleRegistration response', response);
        if (response) {
            router.push('/');
        } else {
            console.error('Registration failed');
        }
    } catch (error) {
        console.error('Registration failed', error);
    }
}
</script>

<style scoped>

</style>
