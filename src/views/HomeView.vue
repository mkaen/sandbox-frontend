<template>
    <button @click="handleRefreshToken">Refresh Token</button>
</template>

<script setup>
import { useAuthStore } from '@/features/auth/authStore';

const authStore = useAuthStore();


const handleRefreshToken = async () => {
    await authStore.refreshToken();
};
</script>
