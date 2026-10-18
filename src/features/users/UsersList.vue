<template>
    <base-card style="max-width: 70rem;">
        <div class="filter-content">
            <UsersFilter 
            @filter-input-values="setFilterValues"
            @pagination-size="savePaginationSize"
            />
            <UsersPagination/>            
            <button type="button" @click="start">Filtri väärtused</button>
            <UsersItem/>
            <UsersPagination/>
        </div>
    </base-card>
</template>


<script setup>
import UsersFilter from '@/features/users/UsersFilter.vue';
import UsersItem from '@/features/users/UsersItem.vue';
import UsersPagination from './UsersPagination.vue';
// import { ROLES } from '@/constants/constants';
import { DEFAULT_PAGINATION_PAGE_SIZE, FIRST_PAGINATION_PAGE } from '@/constants/enums';
import { onMounted, watch, reactive, ref } from 'vue'
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
    console.log(users.value, totalPages.value)
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
</style>