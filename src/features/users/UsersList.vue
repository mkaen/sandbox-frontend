<template>
    <base-card style="max-width: 70rem;">
        <div class="filter-content">
            <UsersFilter 
            @filter-input-values="setFilterValues"
            @pagination-size="savePaginationSize"
            />
            <UsersPagination/>            
            <!-- <button type="button" @click="start">Filtri väärtused</button> -->
            <ul>
                <UsersItem class="user-item"
                v-for="user in users"
                :key=user.id
                :id=user.id
                :firstName="user.firstName"
                :lastName="user.lastName"
                :email="user.email"
                :isArchived="user.isArchived"
                :role="user.role"
                />
            </ul>
            <UsersPagination/>
        </div>
    </base-card>
</template>


<script setup>
import UsersFilter from '@/features/users/UsersFilter.vue';
import UsersItem from '@/features/users/UsersItem.vue';
import UsersPagination from './UsersPagination.vue';
import { DEFAULT_PAGINATION_PAGE_SIZE, FIRST_PAGINATION_PAGE } from '@/constants/enums';
import { onMounted, watch, reactive, ref } from 'vue';
import { useUserStore } from './userStore.js';

const userStore = useUserStore();

const users = ref([]);
const totalPages = ref(1);


const filterValues = reactive({
    nameFilter: null,
    role: null,
    size: DEFAULT_PAGINATION_PAGE_SIZE,
    page: FIRST_PAGINATION_PAGE
});

function setFilterValues(filterBy) {
    filterValues.nameFilter = filterBy.search;
    filterValues.role = filterBy.role;
    filterValues.page = FIRST_PAGINATION_PAGE;
}

function savePaginationSize(size) {
    filterValues.size = size;
    filterValues.page = FIRST_PAGINATION_PAGE;
}

function start() {
    console.log(filterValues);
}

async function loadUsers() {
    const response = await userStore.fetchUsers({...filterValues});
    if (!response) return
    users.value = response.users
    totalPages.value = response.totalPages
}
watch(filterValues, loadUsers)
onMounted(loadUsers)

</script>


<style scoped>
.filter-content {
    max-width: 90rem;
}
nav {
    display: flex;
    justify-content: center;
}
ul {
    margin: 0;
    padding: 0;
}
.user-item {
    margin: 0.2em 0;
}
</style>