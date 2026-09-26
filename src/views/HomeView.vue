<template>
    <h1>
        {{ t('WELCOME') }} <span v-if="isAuthenticated">{{ userName }}</span>!
    </h1>
    <span>{{ t('WELCOME_TEXT') }}</span>
</template>

<script setup>
import { useUserStore } from '@/features/users/userStore';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();

const userStore = useUserStore();
const isAuthenticated = computed(() => userStore.isAuthenticated);
const userName = computed(() => userStore.fullName);

</script>
