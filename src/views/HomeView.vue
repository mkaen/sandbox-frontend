<template>
    <h1>{{ welcomeHeading }}</h1>
    <span>{{ t('WELCOME_TEXT') }}</span>
</template>

<script setup>
import { useUserStore } from '@/features/users/userStore';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const userStore = useUserStore();

const welcomeHeading = computed(() => {
    const welcome = t('WELCOME');
    if (!userStore.isAuthenticated) {
        return `${welcome}!`;
    }
    const name = userStore.fullName.trim();
    return name ? `${welcome} ${name}!` : `${welcome}!`;
});

</script>
