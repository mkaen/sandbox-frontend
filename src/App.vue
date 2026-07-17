<template>
  <DefaultLayout />
  <SessionModal
    ref="sessionModal"
    @extend="onExtendSession"
    @cancel="onCancelSession"
  />
</template>

<script setup>
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import SessionModal from '@/components/modals/SessionModal.vue'
import { inactive, activateReminder, resetSession, dismissReminder } from '@/composables/sessionManager'
import { useAuthStore } from '@/features/auth/authStore'
import { useRouter } from 'vue-router'
import { watch, ref } from 'vue'

const authStore = useAuthStore();
const router = useRouter();
const sessionModal = ref(null);

watch(inactive, (newVal) => {
  if (newVal) {
    console.log('INACTIVE');
    sessionModal.value?.closeModal();
    authStore.logout();
    router.push('/login');
  }
});

watch(activateReminder, (newVal) => {
  if (newVal) {
    console.log('REMINDER ACTIVATED');
    openSessionModal();
  }
});

function openSessionModal() {
  sessionModal.value?.openModal();
}

function onExtendSession() {
  resetSession();
  sessionModal.value?.closeModal();
}

function onCancelSession() {
  dismissReminder();
  sessionModal.value?.closeModal();
}

</script>
