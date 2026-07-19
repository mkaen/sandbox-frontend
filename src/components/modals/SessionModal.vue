<template>
  <dialog
    ref="dialogEl"
    class="modal-overlay"
    aria-labelledby="session-modal-title"
    @cancel.prevent="cancel"
    @click.self="cancel"
  >
    <div class="modal-box">
      <h2 id="session-modal-title">Session Timeout Reminder</h2>
      <p>Your session is about to expire. Do you want to proceed?</p>

      <div class="modal-actions">
        <button class="btn btn-cancel" @click="cancel">Cancel</button>
        <button class="btn btn-extend" @click="extend">Extend Session</button>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { ref } from 'vue'

const dialogEl = ref(null)

function openModal() {
  dialogEl.value?.showModal()
}

function closeModal() {
  if (dialogEl.value?.open) {
    dialogEl.value.close()
  }
}

function cancel() {
  closeModal()
  emit('cancel')
}

function extend() {
  closeModal()
  emit('extend')
}

const emit = defineEmits(['extend', 'cancel'])

defineExpose({ openModal, closeModal })
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  z-index: 1000;
}

.modal-overlay[open] {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 15vh;
}

.modal-overlay::backdrop {
  background: rgba(0, 0, 0, 0.5);
}

.modal-box {
  background: #fff;
  border-radius: 8px;
  padding: 24px 28px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.modal-box h2 {
  margin: 0 0 12px;
  font-size: 1.2rem;
}

.modal-box p {
  margin: 0 0 20px;
  color: #444;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
}

.btn-cancel {
  background: #e5e7eb;
  color: #111;
}

.btn-cancel:hover {
  background: #d1d5db;
}

.btn-extend {
  background: #2563eb;
  color: #fff;
}

.btn-extend:hover {
  background: #1d4ed8;
}
</style>
