<template>
    <button
        :type="type"
        :disabled="disabled"
        :class="variant"
        :style="{minWidth: width}"
    >
        {{ resolvedLabel }}
    </button>
</template>


<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
    label: {
        type: String,
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
    },
    variant: {
        type: String,
        default: 'primary',
        validator: (value) => ['primary', 'danger'].includes(value),
    },
});

const resolvedLabel = computed(() => props.label ?? t('BUTTON.OK'));
</script>


<style scoped>
button {
    color: #ffffff;
    border: 5px ridge rgba(255, 255, 255, 0.5);
    padding: 8px 16px;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.5s ease-in-out;
}

button.primary {
    background-color: #2a74c2;
    &:hover:not(:disabled) {
        background-color: #004085;
    }
}

button.danger {
    background-color: #c23a2a;
    &:hover:not(:disabled) {
        background-color: #8b1e14;
    }
}

button:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
}
</style>
