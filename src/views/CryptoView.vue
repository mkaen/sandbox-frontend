<template>
    <h1>{{ t('CRYPTO.VALUE') }}</h1>
    <p>{{ t('CRYPTO.INTRO') }}</p>
    <StandardAssetsTable :assets="standardAssets"/>
</template>


<script setup>
import { useI18n } from 'vue-i18n';
import { cryptoApi } from '@/config/api';
import { onBeforeMount, ref } from 'vue';
import StandardAssetsTable from '@/features/crypto/StandardAssetsTable.vue';

const {t} = useI18n();

const standardAssets = ref([])

async function fetchStandardAssets() {
    try {
        const response = await cryptoApi.get('/standard-assets');
        if (response.status !== 200) {
            return
        }
        console.log(response.data);
        return response.data
    } 
    catch (error) {
        console.error("Fetching standard crypto asset info failed", error)
    }
}

onBeforeMount(async () => {
    const data = await fetchStandardAssets()
    if (data) {
        standardAssets.value = data
    }
})

</script>