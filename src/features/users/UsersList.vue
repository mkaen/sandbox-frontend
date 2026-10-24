<template>
    <base-card style="max-width: 70rem;">
        <div class="filter-content">
            <UsersFilter
            :users-total="totalUsers"
            @filter-input-values="setFilterValues"
            @pagination-size="savePaginationSize"
            />
            <UsersPagination 
            :total-pages="totalPages"
            :current-page="currentPage"
            @change-page="changePageTo"
            />
            <hr style="color: var(--text-h-blue);"/>       
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
            <hr style="color: var(--text-h-blue);"/>
            <UsersPagination 
            :total-pages="totalPages"
            :current-page="currentPage"
            @change-page="changePageTo"
            />
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
const currentPage = ref(1);
const size = ref(1);
const totalUsers = ref(0);



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

function changePageTo(page) {
    filterValues.page = page
    loadUsers();
}

async function loadUsers() {
    const response = await userStore.fetchUsers({...filterValues});
    if (!response) return
    totalPages.value = response.totalPages
    currentPage.value = response.page
    size.value =response.size
    totalUsers.value = response.totalUsers
    users.value = response.users
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