<template>
    <button :type="type" :disabled="disabled" :style="{minWidth: width}">{{ label }}</button>
</template>


<script setup>
defineProps({
    label: {
        type: String,
        default: 'OK',
    },
    type: {
        type: String,
        default: 'button',
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    width: {
        type: String,
        default: '6rem'
    }
});
</script>


<style scoped>
button {
    background-color: #2a74c2;
    color: #ffffff;
    border: 5px ridge rgba(255, 255, 255, 0.5);
    padding: 8px 16px;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.5s ease-in-out;
    &:hover:not(:disabled) {
        background-color: #004085;
    }
    &:disabled {
        background-color: #6c757d;
        cursor: not-allowed;
    }
}
</style>