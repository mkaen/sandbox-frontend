<template>
    <dialog
    ref="modalEl"
    class="modal-overlay"
    aria-labelledby="modal-title"
    @cancel.prevent="cancel"
    @click.self="cancel"
    >
    <div class="modal-box">
      <div class="modal-header"> 
        <h2 id="modal-title">{{ title }}</h2>
        <img :src=closeButton alt="close" @click="cancel" width="20px"/>
      </div>
      <p>{{ body }}</p>

        <div class="modal-actions">
        <button v-if="showCancel" class="btn btn-cancel" @click="cancel">{{ cancelButtonLabel }}</button>
        <PrimaryButton :label="okButtonLabel" @click="ok" />
      </div>
    </div>
  </dialog>
</template>


<script setup>
import { ref } from 'vue';
import PrimaryButton from '../buttons/PrimaryButton.vue';
import closeButton from '@/assets/model-close-icon.jpg'
const modalEl = ref(null);


defineExpose({ openModal, closeModal })


const props = defineProps({
    showCancel: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true
    },
    cancelButtonLabel: {
        type: String,
        default: 'Cancel'
    },
    okButtonLabel: {
        type: String,
        default: 'OK'
    }
});

const emit = defineEmits(['cancel', 'ok']);


function cancel() {
    if (!props.showCancel) return
    closeModal()
    emit('cancel');
}

function ok() {
    closeModal()
    emit('ok')
}

function openModal() {
    modalEl.value?.showModal()
}

function closeModal() {
    if (modalEl.value?.open) {
    modalEl.value.close()
  }
}

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
  padding: 12px 14px;
  max-width: 450px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  text-align: start;
}

.modal-box h2 {
  font-size: 1.2rem;
}

.modal-header {
  display: flex;
  direction: row;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1.2px solid rgba(0, 0, 0, 0.25);
  margin-bottom: 1.5rem;
}

.modal-box p {
  margin: 0 0 20px;
  color: #444;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
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

img:hover {
  border: 1px solid black;
  border-radius: 5px;
}

</style>