<template>
    <nav aria-label="Users pagination">
        <ul class="pagination">
            <li class="page-item" :class="{disabled : isFirstPage}">
                <button type="button" class="page-link" :disabled="isFirstPage" @click="goToPreviousPage" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </button>
            </li>

            <li v-for="page in visiblePages"
                :key="page"
                class="page-item"
                :class="{active: page === currentPage}"
                >
                <button type="button" class="page-link" @click="selectPage(page)">{{ page }}</button>
            </li>

            <li class="page-item" :class="{disabled : isFinalPage}">
                <button type="button" class="page-link" :disabled="isFinalPage" @click="goToNextPage" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </button>
            </li>
        </ul>
    </nav>
</template>


<script setup>
import { computed } from 'vue';
import { SHOW_MAX_PAGINATION_PAGES } from '@/constants/enums';

const props = defineProps({
    currentPage: {
        type: Number,
        required: true
    },
    totalPages: {
        type: Number,
        required: true
    },
});

const emit = defineEmits(['change-page'])

const isFirstPage = computed(() => props.currentPage === 1);
const isFinalPage = computed(() => props.currentPage >= props.totalPages);


const visiblePages = computed(() => {
    const count = Math.min(props.totalPages, SHOW_MAX_PAGINATION_PAGES)
    const half = Math.floor(count / 2)
    const start = Math.max(1, Math.min(props.currentPage - half, props.totalPages - count + 1))
    return Array.from({ length: count }, (_, index) => start + index)
})

const goToPreviousPage = () => {
    if (props.currentPage <= 1) {
        return
    }
    emit('change-page', props.currentPage - 1)
};

const selectPage= (page) => {
    emit('change-page', page)
}

const goToNextPage = () => {
    if (isFinalPage.value) return
    emit('change-page', props.currentPage + 1)
};

</script>