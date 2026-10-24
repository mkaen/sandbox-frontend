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
            <div class="users-header">
                <span>{{ t('NAME') }}</span>
                <span class="users-header-email">{{ t('EMAIL') }}</span>
                <div class="users-header-actions">
                    <span>{{ t('ROLE.VALUE') }}</span>
                    <span class="users-header-profile-spacer"></span>
                </div>
            </div>
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
import { useI18n } from 'vue-i18n';
import { useUserStore } from './userStore.js';

const { t } = useI18n();
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
    --users-grid-columns: minmax(0, 1fr) minmax(0, 1fr) 9rem;
    --users-grid-gap: 2rem;
    --users-actions-gap: 0.5rem;
    --users-profile-link-width: 1.5rem;
}
.users-header {
    display: grid;
    grid-template-columns: var(--users-grid-columns);
    column-gap: var(--users-grid-gap);
    padding: 0 1rem 0.2em;
    font-weight: 600;
    color: var(--text-h-blue);
}
.users-header-email {
    text-align: center;
}
.users-header-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--users-actions-gap);
}
.users-header-profile-spacer {
    width: var(--users-profile-link-width);
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