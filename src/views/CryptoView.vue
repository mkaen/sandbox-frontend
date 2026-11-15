<template>
    <h1>{{ t('CRYPTO.VALUE') }}</h1>
    <p>{{ t('CRYPTO.INTRO') }}</p>
    <hr/>
    <h3>{{ t('POPULAR_ASSETS') }}</h3>
    <PopularAssetsTable :popularAssets="popularAssets"/>
</template>


<script setup>
import { useI18n } from 'vue-i18n';
import { cryptoApi } from '@/config/api';
import { onBeforeMount, ref } from 'vue';
import PopularAssetsTable from '@/features/crypto/PopularAssetsTable.vue';

const {t} = useI18n();

const popularAssets = ref([])

async function fetchPopularAssets() {
    try {
        const response = await cryptoApi.get('/popular-assets');
        if (response.status !== 200) {
            return
        }
        return response.data
    } 
    catch (error) {
        console.error("Fetching standard crypto assets failed", error)
    }
}

function normalizePopularAssets(assets) {
  if (!Array.isArray(assets)) {
    return []
  }
  return assets.map((asset) => ({
    currency: asset.currency,
    priceUsd: asset.priceUsd,
    athChange: asset.athChange,
    change24h: asset.change24h,
    marketCapUsd: asset.marketCapUsd,
    marketCapRank: asset.marketCapRank,
    imageThumb: asset.imageThumb,
    updatedAt: asset.updatedAt,
  }))
}

onBeforeMount(async () => {
    const data = await fetchPopularAssets()
    if (data?.assets) {
        popularAssets.value = normalizePopularAssets(data.assets)
    }
})

</script>

<style scoped>
h3 {
    color: var(--text-h-blue);
    margin-top: 2rem;
}
</style>