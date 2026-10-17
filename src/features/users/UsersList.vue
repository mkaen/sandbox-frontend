<template>
    <base-card style="max-width: 60rem;">
        <div class="filter-content">
            <UsersFilter @filterInputValues="fetchFilteredUsers"/>

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

const fiterValues = {
    search: null | String,
    role: null | ROLES,
    paginationSize: DEFAULT_PAGINATION_PAGE_SIZE
}

function fetchFilteredUsers(filterBy) {
    console.log(filterBy);
    fiterValues.search = filterBy.search;
    fiterValues.role = filterBy.role;
}

function start() {
    console.log(fiterValues);
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