<template>
    <base-card width="28rem">
        <h1 class="text-center mb-3">{{ t('REGISTER_NEW_ACCOUNT') }}</h1>
        <RegistrationForm @submit-form="handleRegistration" />
    </base-card>
</template>

<script setup>
import RegistrationForm from '../forms/RegistrationForm.vue';
import { useAuthStore } from '../authStore';
import { useRouter } from 'vue-router';
import { useToast } from '@/utils/toastUtils.js';
import { useI18n } from 'vue-i18n';

const toast = useToast();
const { t } = useI18n();

const authStore = useAuthStore();
const router = useRouter();

const handleRegistration = async (payload, image) => {
    const response = await authStore.register(payload, image);
    if (response.success) {
        router.push('/');
    } else {
        const toastInfoReference = response.notificationCode ? response.notificationCode : 'GENERAL'
        toast.makeErrorToast(t('ERRORS.' + toastInfoReference));
    }
}
</script>
