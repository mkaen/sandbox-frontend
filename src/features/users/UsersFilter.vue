<template>
    <h2>{{ t('FILTER_USERS') }}</h2>
    <form class="form" @submit.prevent="filterUsers">
        <input type="search" :placeholder="`${ t('SEARCH') }...`" :aria-label="`${ t('SEARCH') }`" v-model="searchInput"/>
        <div class="dropdown">
            <HeaderLoginButton
                class="button role-dropdown-selector dropdown-toggle"
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
                    <button class="dropdown-item" type="button" @click="setChosenRole(ROLES.ADMIN)">{{ t('ROLE.ADMIN') }}</button>
                </li>
                <li>
                    <button class="dropdown-item" type="button" @click="setChosenRole(ROLES.USER)">{{ t('ROLE.USER') }}</button>
                </li>
            </ul>
        </div>
        <HeaderLoginButton class="button submit-button" type="submit" :label="`${ t('SEARCH') }`"/>
    </form>
    <hr style="color: var(--text-h-blue);"/>
    <div class="total-rows">
        <h6 class="total-users">{{ t('USERS_FOUND_TOTAL', {total: usersTotal}) }}</h6>
        <div class="pagination-size-selector">
            <h6>{{ t('ROWS_PER_PAGE') }}</h6>
            <div class="dropdown">
                <HeaderLoginButton class="button pagination-button dropdown-toggle"
                type="button"
                :label="paginationSize" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
                />
                <ul class="dropdown-menu dropdown-menu-end pagination-dropdown-menu">
                    <li v-for="size in PaginationPageSize" :key="size">
                        <button class="dropdown-item pagination-dropdown-item" type="button" @click="setPaginationSize(size)">{{ size }}</button>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>


<script setup>
import HeaderLoginButton from '@/components/buttons/HeaderLoginButton.vue';
import { PaginationPageSize, DEFAULT_PAGINATION_PAGE_SIZE } from '@/constants/enums';
import { ROLES } from '@/constants/constants';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const{ t } = useI18n();

defineProps({
    usersTotal: Number
})

const emit = defineEmits(['filterInputValues', 'paginationSize'])

const chosenRole = ref(null);
const searchInput = ref('');
const paginationSize = ref(DEFAULT_PAGINATION_PAGE_SIZE)

const setChosenRole = (role) => {
    chosenRole.value = role;
};

const setPaginationSize = (size) => {
    paginationSize.value = size;
    emit('paginationSize', size)
}

const filterUsers = () => {
    emit('filterInputValues', {search: searchInput.value.trim() || null, role: chosenRole.value || null});
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
    margin: 2rem 0   
}
.pagination-size-selector {
    --pagination-control-width: 3.5rem;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}
.total-rows {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2.5rem;
}
h6, h2 {
    margin: 0;
}
.pagination-button {
    width: var(--pagination-control-width);
    padding-left: 0.75rem;
    padding-right: 1.75rem;
    text-align: left;
}
.pagination-button::after {
    right: 0.6rem;
}
.pagination-dropdown-menu {
    width: var(--pagination-control-width);
    min-width: var(--pagination-control-width);
}
.pagination-dropdown-item {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    display: flex;
    justify-content: center;
}
.role-dropdown-selector {
    max-width: 7.1rem;
}
.total-users {
    display: flex;
    justify-content: flex-start;
    margin: 0.5rem
}
.submit-button {
    box-shadow: inset 0 0 8px var(--text-h-blue);
    margin: 0.5rem 0.5rem 0.5rem 7rem
}
.submit-button:hover {
    box-shadow: inset 0 0 12px var(--text-h-blue);
}

@media (max-width: 52rem) {
    form {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
        margin: 1.5rem 0;
    }
    form input,
    form .button,
    form .dropdown {
        width: 100%;
        margin: 0;
    }
    form input,
    form .button {
        height: 2.5rem;
    }
    form .dropdown-menu {
        width: 100%;
        margin-right: 0;
    }
}
</style>