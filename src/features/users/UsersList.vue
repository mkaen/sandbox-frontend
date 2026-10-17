<template>
    <base-card style="max-width: 60rem;">
        <div class="filter-content">
            <UsersFilter 
            @filter-input-values="fetchFilteredUsers"
            @pagination-size="savePaginationSize"
            />

            <nav aria-label="Page navigation example">
            <ul class="pagination">
                <li class="page-item">
                    <a class="page-link" href="#" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                <li class="page-item"><a class="page-link" href="#">1</a></li>
                <li class="page-item"><a class="page-link" href="#">2</a></li>
                <li class="page-item"><a class="page-link" href="#">3</a></li>
                <li class="page-item">
                <a class="page-link" href="#" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </a>
                </li>
            </ul>
            </nav>
            <button type="button" @click="start">Filtri väärtused</button>
            <UsersItem/>
        </div>
    </base-card>
</template>


<script setup>
import UsersFilter from '@/features/users/UsersFilter.vue';
import UsersItem from '@/features/users/UsersItem.vue';
import {ROLES} from '@/constants/constants';
import { DEFAULT_PAGINATION_PAGE_SIZE } from '@/constants/enums';

const filterValues = {
    search: null | String,
    role: null | ROLES,
    paginationSize: DEFAULT_PAGINATION_PAGE_SIZE
}

function fetchFilteredUsers(filterBy) {
    filterValues.search = filterBy.search;
    filterValues.role = filterBy.role;
}

function savePaginationSize(size) {
    filterValues.paginationSize = size;
}

function start() {
    console.log(filterValues);
}
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