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
            <div class="users-header">
                <span>{{ t('NAME') }} 
                    <button type="button" class="sort-button" :aria-label="t('SORT_BY_SELECTOR')" @click="orderBy(SortBy.LAST_NAME)">
                        <img :src="sortButton" alt=""/>
                    </button>
                </span>
                <span class="users-header-email">{{ t('EMAIL') }} 
                    <button type="button" class="sort-button" :aria-label="t('SORT_BY_SELECTOR')" @click="orderBy(SortBy.EMAIL)">
                        <img :src="sortButton" alt=""/>
                    </button>
                </span>
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
import sortButton from '@/assets/icons/arrows-down-up.svg'
import { SortType, SortBy } from '@/constants/enums.js';
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
    sortBy: null,
    sortOrder: null,
    size: DEFAULT_PAGINATION_PAGE_SIZE,
    page: FIRST_PAGINATION_PAGE
});

function setFilterValues(filterBy) {
    filterValues.nameFilter = filterBy.search;
    filterValues.role = filterBy.role;
    filterValues.page = FIRST_PAGINATION_PAGE;
};

function orderBy(type) {
    filterValues.sortBy = type;
    filterValues.sortOrder = !filterValues.sortOrder || filterValues.sortOrder === SortType.DESC ? SortType.ASC : SortType.DESC;
    filterValues.page = FIRST_PAGINATION_PAGE;
    loadUsers();
};

function savePaginationSize(size) {
    filterValues.size = size;
    filterValues.page = FIRST_PAGINATION_PAGE;
    loadUsers();
};

function changePageTo(page) {
    filterValues.page = page;
    loadUsers();
};

async function loadUsers() {
    const response = await userStore.fetchUsers({...filterValues});
    if (!response) return;
    totalPages.value = response.totalPages;
    currentPage.value = response.page;
    size.value =response.size;
    totalUsers.value = response.totalUsers;
    users.value = response.users;
};
watch(filterValues);
onMounted(loadUsers);

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
    padding: 0 1rem 0.1em;
    font-weight: 600;
    color: var(--text-h-blue);
    border-bottom: 1px solid var(--text-h-blue);
    margin: 0.7rem auto;
}
.users-header-email {
    text-align: center;
}
.sort-button {
    padding: 0;
    border: 0;
    background: none;
    line-height: 1;
    cursor: pointer;
}
.sort-button:focus-visible {
    outline: 2px solid var(--text-h-blue);
    outline-offset: 2px;
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
img {
    width: 18px;
}
</style>