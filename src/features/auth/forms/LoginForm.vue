<template>
    <form @submit.prevent="handleSubmit">
        <div class="d-flex flex-column align-items-center">
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" v-model="email" class="form-control"/>
            </div>
            <div class="form-group mt-1">
                <label for="password">Password</label>
                <input type="password" id="password" v-model="password" class="form-control"/>
            </div>
            <button type="submit" class="btn btn-primary mt-3">Login</button>
            <p class="register-link text-center mt-3 mb-0 w-100">
                Haven't registered yet? <a href="/register">Register</a>
            </p>
        </div>
    </form>
</template>


<script setup>
import { ref } from 'vue';

const emit = defineEmits(['submit']);

const email = ref('');
const password = ref('');

const validateForm = () => {
    return email.value !== '' && password.value !== '';
}

const handleSubmit = () => {
    if (validateForm()) {
        emit('submit', { email: email.value, password: password.value });
    }
}

</script>


<style scoped>
.form-group {
    width: 100%;
    margin: 10px 0;
}

.register-link {
    font-size: 0.9rem;
}

input {
    border: 1px solid #b0adb6;
    background-color: transparent;
}
</style>