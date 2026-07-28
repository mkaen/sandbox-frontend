<template>
  <DefaultLayout />
  <notification-modal
    ref="sessionModal"
    :show-cancel="true"
    title="Session Timeout Reminder"
    body="Your session is about to expire. Do you want to extend the session?"
    ok-button-label="Extend session"
    @ok="onExtendSession"
    @cancel="onCancelSession"
  />
  <notification-modal
  ref="loggedOutModal"
  title="Session Expired"
  body="You have been logged out."
  />
</template>

<script setup>
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import { inactive, activateReminder, resetSession, dismissReminder } from '@/composables/sessionManager'
import { useAuthStore } from '@/features/auth/authStore'
import { useRouter } from 'vue-router'
import { watch, ref } from 'vue'

const authStore = useAuthStore();
const router = useRouter();
const sessionModal = ref(null);
const loggedOutModal = ref(null);


// SESSION REMINDER

watch(inactive, (newVal) => {
  if (newVal) {
    sessionModal.value?.closeModal();
    authStore.logout();
    router.push('/login');
    loggedOutModal.value?.openModal()
  }
});

watch(activateReminder, (newVal) => {
  if (newVal) {
    openSessionModal();
  }
});

function openSessionModal() {
  sessionModal.value?.openModal();
}

function onExtendSession() {
  resetSession();
}

function onCancelSession() {
  dismissReminder();
}

</script>
