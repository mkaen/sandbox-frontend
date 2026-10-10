<template>
    <base-card width="20rem">
        <h1 class="text-center mb-3">{{ t('LOGIN') }}</h1>
        <LoginForm @submit="handleLogin" />
    </base-card>
</template>


<script setup>
import LoginForm from '../forms/LoginForm.vue';
import { useAuthStore } from '../authStore';
import { useRoute, useRouter } from 'vue-router';
import { resolveSafeRedirect } from '@/router/redirect';
import { useToast } from '@/utils/toastUtils';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const toast = useToast();

const handleLogin = async (payload) => {
    const response = await authStore.login(payload);
    if (response) {
        router.push(resolveSafeRedirect(router, route.query.redirect));
        toast.makeSuccessToast(t('SUCCESS.LOGIN'));
    }
};
</script>