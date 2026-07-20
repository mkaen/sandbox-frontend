<template>
    <form @submit.prevent="handleSubmit">
        <div class="d-flex flex-column align-items-center">
            <div class="form-group">
                <label for="first-name">First Name</label>
                <input type="text" 
                id="first-name" 
                v-model.trim="firstName.value" 
                class="form-control" 
                :class="{ 'is-invalid': !firstName.isValid }"
                @blur="clearValidity('firstName')"/>
            </div>
            <p v-if="!firstName.isValid" class="text-danger">First name must be between {{ FIRST_NAME_LENGTH_MIN }} and {{ FIRST_NAME_LENGTH_MAX }} characters</p>
            <div class="form-group">
                <label for="last-name">Last Name</label>
                <input type="text"
                id="last-name" 
                v-model.trim="lastName.value" 
                class="form-control" 
                :class="{ 'is-invalid': !lastName.isValid }" 
                @blur="clearValidity('lastName')"/>
            </div>
            <p v-if="!lastName.isValid" class="text-danger">Last name must be between {{ LAST_NAME_LENGTH_MIN }} and {{ LAST_NAME_LENGTH_MAX }} characters</p>
            <div class="form-group">
                <label for="phone">Phone</label>
                <input type="tel" 
                id="phone" 
                v-model.trim="phone.value" 
                class="form-control" 
                :class="{ 'is-invalid': !phone.isValid }"
                @blur="clearValidity('phone')"/>
            </div>
            <p v-if="!phone.isValid" class="text-danger">Phone must be a valid phone number</p>
            <div class="form-group">
                <label for="email">E-mail</label>
                <input type="email" 
                id="email" 
                v-model.trim="email.value" 
                class="form-control" 
                :class="{ 'is-invalid': !email.isValid }" 
                @blur="clearValidity('email')"/>
            </div>
            <p v-if="!email.isValid" class="text-danger">Invalid e-mail address</p>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" 
                id="password" 
                v-model.trim="password.value" 
                class="form-control" 
                :class="{ 'is-invalid': !password.isValid }" 
                @blur="clearValidity('password')"/>
            </div>
            <p v-if="!password.isValid" class="text-danger">Password must be at least {{ PASSWORD_LENGTH_MIN }} characters long</p>
            <div class="form-group">
                <label for="password-confirm">Confirm Password</label>
                <input type="password" 
                id="password-confirm" 
                v-model.trim="passwordConfirm.value" 
                class="form-control" 
                :class="{ 'is-invalid': !passwordConfirm.isValid }" 
                @blur="clearValidity('passwordConfirm')"/>
            </div>
            <p v-if="!passwordConfirm.isValid" class="text-danger">Passwords do not match</p>
            <div class="form-group">
                <label for="image">Add an image</label>
                <input type="file" 
                id="image" 
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple="false"
                @change="handleImageUpload"
                class="form-control"
                :class="{ 'is-invalid': !image.isValid }" />
            </div>
            <p v-if="!image.isValid" class="text-danger">{{ image.error }}</p>
            <button type="submit" class="btn btn-primary mt-3">Create account</button>
            <p class="register-link text-center mt-3 mb-0 w-100">
                Already have an account? <a href="/login">Login</a>
            </p>
        </div>
    </form>
</template>


<script setup>
import { reactive } from 'vue';
import { FIRST_NAME_LENGTH_MIN, 
    FIRST_NAME_LENGTH_MAX, 
    LAST_NAME_LENGTH_MIN, 
    LAST_NAME_LENGTH_MAX, 
    PASSWORD_LENGTH_MIN,
    PHONE_LENGTH_MIN,
    PHONE_LENGTH_MAX } from '@/constants/constants';
import { EMAIL_VALIDATION_PATTERN } from '@/utils/validation';
import { validateProfileImageFile } from '@/utils/imageFile';

const emit = defineEmits(['submit-form']);

const firstName = reactive({ value: '', isValid: true });
const lastName = reactive({ value: '', isValid: true });
const phone = reactive({ value: '', isValid: true });
const email = reactive({ value: '', isValid: true });
const password = reactive({ value: '', isValid: true });
const passwordConfirm = reactive({ value: '', isValid: true });
const image = reactive({ value: null, isValid: true, error: '' });

const fields = { firstName, lastName, phone, email, password, passwordConfirm, image };
let formIsValid = true;

const validateForm = () => {
    formIsValid = true
      
      if (firstName.value.trim() === '' || firstName.value.length < FIRST_NAME_LENGTH_MIN || firstName.value.length > FIRST_NAME_LENGTH_MAX) {
        firstName.isValid = false;
        formIsValid = false;
      }
      if (lastName.value.trim() === '' || lastName.value.length < LAST_NAME_LENGTH_MIN || lastName.value.length > LAST_NAME_LENGTH_MAX) {
        lastName.isValid = false;
        formIsValid = false;
      }
      if (phone.value.trim() === '' || phone.value.length < PHONE_LENGTH_MIN || phone.value.length > PHONE_LENGTH_MAX) {
        phone.isValid = false;
        formIsValid = false;
      }
      if (email.value === '' || !EMAIL_VALIDATION_PATTERN.test(email.value)) {
        email.isValid = false;
        formIsValid = false;
      }
        if (password.value.trim() === '' || password.value.length < PASSWORD_LENGTH_MIN) {
        password.isValid = false;
        formIsValid = false;
      }
      if (passwordConfirm.value !== password.value || passwordConfirm.value.trim() === '') {
        password.isValid = false;
        passwordConfirm.isValid = false;
        formIsValid = false;
      }
      if (!image.isValid) {
        formIsValid = false;
      }
}

const handleSubmit = () => {
    validateForm();
    if (!formIsValid) {
        return;
    }
    const formData = {
        firstName: firstName.value,
        lastName: lastName.value,
        phone: phone.value,
        email: email.value,
        password: password.value,
        hasImage: !!image.value,
    }

    emit('submit-form', formData, image.value ? image.value : null);
}

const clearValidity = (fieldName) => {
    fields[fieldName].isValid = true;
    if (fieldName === 'image') {
        fields[fieldName].error = '';
    }
}

const handleImageUpload = async (event) => {
    const input = event.target;
    const file = input.files[0];
    image.isValid = true;
    image.error = '';

    if (!file) {
        image.value = null;
        return;
    }

    const result = await validateProfileImageFile(file);
    if (!result.ok) {
        image.isValid = false;
        image.error = result.error;
        image.value = null;
        input.value = '';
        return;
    }

    image.value = file;
}

</script>


<style scoped>
.form-group {
    width: 100%;
    margin: 10px 0;
    position: relative;
}

.register-link {
    font-size: 0.9rem;
}

input {
    border: 1px solid #b0adb6;
    background-color: transparent;
}

.is-invalid {
    border-color: #dc3545;
}
p {
    font-size: 0.8rem;
    align-self: flex-start;
}
</style>