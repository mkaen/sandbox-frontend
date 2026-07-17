<template>
    <button>{{ text }}</button>
</template>


<script setup>
const props = defineProps({
    text: {
        type: String,
        required: true,
    }
})
</script>


<style scoped>
button {
    border: solid .1px #ffffff;
    border-radius: .375rem;
    padding: .375rem .75rem;
    background-color: transparent;
    color: #ffffff;
    font-size: inherit;
    cursor: pointer;
    transition: all 1s ease-out;
    &:hover {
        background-color: #ffffff;
        color: #000000;
    }
}
</style>