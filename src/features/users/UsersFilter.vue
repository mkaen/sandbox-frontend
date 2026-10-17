<template>
    <h2>{{ t('FILTER_USERS') }}</h2>
    <form class="form" @submit.prevent="filterUsers">
        <input type="search" :placeholder="`${ t('SEARCH') }...`" :aria-label="`${ t('SEARCH') }`" v-model="searchInput"/>
        <div class="dropdown">
            <HeaderLoginButton
                class="button dropdown-toggle"
                type="button"
                :label="chosenRole ?? t('ROLE.VALUE')"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            />
            <ul class="dropdown-menu dropdown-menu-end">
                <li>
                    <button class="dropdown-item" type="button" @click="setChosenRole(null)">{{ t('ROLE.ALL') }}</button>
                </li>
                <li>
                    <button class="dropdown-item" type="button" @click="setChosenRole(role)">{{ t('ROLE.ADMIN') }}</button>
                </li>
                <li>
                    <button class="dropdown-item" type="button" @click="setChosenRole(role)">{{ t('ROLE.USER') }}</button>
                </li>
            </ul>
        </div>
        <HeaderLoginButton class="button" type="submit" :label="`${ t('SEARCH') }`"/>
    </form>
</template>


<script setup>
import {ROLES} from '@/constants/constants.js';
import HeaderLoginButton from '@/components/buttons/HeaderLoginButton.vue';
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';

const{ t } = useI18n();

const chosenRole = ref(null);
const searchInput = ref('');

const filterUsers = () => {
    console.log(searchInput.value, chosenRole.value);
};
const setChosenRole = (role) => {
    chosenRole.value = role;
};
</script>


<style scoped>
input,
.button {
    border: var(--text-h-blue) solid 1px;
    border-radius: 10px;
    margin: 0.5rem;
    width: 12rem;
    height: 2rem;
    color: var(--text-h-blue);
}
.dropdown-toggle {
    position: relative;
    text-align: center;
}

.dropdown-toggle::after {
    position: absolute;
    top: 50%;
    right: 0.75rem;
    margin: 0;
    transform: translateY(-50%);
    
}
.dropdown-menu {
    --bs-dropdown-bg: var(--bg);
    --bs-dropdown-color: var(--text-h-blue);
    --bs-dropdown-border-color: var(--text-h-blue);
    --bs-dropdown-link-color: var(--text-h-blue);
    --bs-dropdown-link-hover-color: #ffffff;
    --bs-dropdown-link-hover-bg: var(--text-h-blue);
    --bs-dropdown-link-active-color: var(--text-h-blue);
    min-width: 2rem;
    margin-right: 0.5rem;
}
form {
    display: flex;
    flex-direction: row;
    justify-content: center;    
}
</style>