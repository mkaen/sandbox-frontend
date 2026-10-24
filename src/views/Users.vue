<template>
    <h1>{{ t('USERS') }}</h1>
    <UsersList/>
</template>


<script setup>
import { useI18n } from 'vue-i18n';
import UsersList from '@/features/users/UsersList.vue';

const { t } = useI18n();

</script>