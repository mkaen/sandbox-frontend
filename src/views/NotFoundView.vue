<template>
    <base-card>
        <div class="d-flex flex-column align-items-center justify-content-center gap-1">
            <h1 class="text-center">Page not found - 404</h1>
            <p class="mb-4 text-center">Something went wrong. Please check the URL and try again.</p>
            <confirmation-button label="Go to Homepage" @click="navigateToHome"/>
        </div>
    </base-card>
</template>


<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function navigateToHome() {
    router.push('/');
}
</script>
