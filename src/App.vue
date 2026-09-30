<template>
  <DefaultLayout />
  <notification-modal
    ref="sessionModal"
    :show-cancel="true"
    :title="t('MODAL.SESSION_TIMEOUT_TITLE')"
    :body="t('MODAL.SESSION_TIMEOUT_BODY')"
    :confirm-button-label="t('BUTTON.EXTEND_SESSION')"
    @confirm="onExtendSession"
    @cancel="onCancelSession"
  />
  <notification-modal
    ref="loggedOutModal"
    :title="t('MODAL.SESSION_EXPIRED_TITLE')"
    :body="t('MODAL.SESSION_EXPIRED_BODY')"
  />
</template>

<script setup>
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import { inactive, activateReminder, resetSession, dismissReminder } from '@/composables/sessionManager'
import { useAuthStore } from '@/features/auth/authStore'
import { useRouter } from 'vue-router'
import { watch, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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