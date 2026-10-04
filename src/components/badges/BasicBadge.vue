<template>
    <component
        :is="clickable ? 'button' : 'span'"
        type="button"
        class="badge rounded-pill"
        :class="variantClass"
        :disabled="clickable && disabled"
        @click="onClick"
    >
        {{ label }}
    </component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    label: {
        type: String,
        required: true,
    },
    variant: {
        type: String,
        default: 'secondary',
    },
    clickable: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['click'])

const variantClass = computed(() => `text-bg-${props.variant}`)

function onClick(event) {
    if (!props.clickable || props.disabled) {
        return
    }
    emit('click', event)
}
</script>

<style scoped>
button.badge {
    border: none;
    cursor: pointer;
}

button.badge:disabled {
    cursor: not-allowed;
    opacity: 0.65;
}
</style>
