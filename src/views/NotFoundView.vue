<template>
    <base-card>
        <div class="d-flex flex-column align-items-center justify-content-center gap-1">
            <h1 class="text-center">{{ t('ERROR.PAGE_NOT_FOUND') }}</h1>
            <p class="mb-4 text-center">{{ t('ERROR.PAGE_NOT_FOUND_CONTENT') }}</p>
            <confirmation-button :label="`${t('BUTTON.TO_HOMEPAGE')}`" @click="navigateToHome"/>
        </div>
    </base-card>
</template>


<script setup>
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n()
const router = useRouter();

function navigateToHome() {
    router.push('/');
}
</script>
