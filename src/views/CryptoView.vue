<template>
    <h1>{{ t('CRYPTO.VALUE') }}</h1>
    <p>{{ t('CRYPTO.INTRO') }}</p>
    <hr/>
    <h3>{{ t('POPULAR_ASSETS') }}</h3>
    <div v-if="userStore.isAdmin" class="refresh-assets-header">
        <ConfirmationButton
            :label="t('REFRESH_MANUALLY')"
            :variant="'success'"
            @click="refreshAssetsManually"
        >
        </ConfirmationButton>
    </div>
    <PopularAssetsTable :popularAssets="popularAssets"/>
</template>


<script setup>
import { useI18n } from 'vue-i18n';
import { useToast } from '@/utils/toastUtils';
import { cryptoApi } from '@/config/api';
import { onBeforeMount, ref } from 'vue';
import PopularAssetsTable from '@/features/crypto/PopularAssetsTable.vue';
import ConfirmationButton from '@/components/buttons/ConfirmationButton.vue';
import { useUserStore } from '@/features/users/userStore'

const {t} = useI18n();
const toast = useToast();

const userStore = useUserStore();
const popularAssets = ref([]);

async function fetchPopularAssets() {
    try {
        const response = await cryptoApi.get('/popular-assets');
        if (response.status !== 200) {
            toast.makeErrorToast(t('ERRORS.GENERAL'))
            return
        }
        toast.makeSuccessToast(t('CRYPTO.ASSETS_REFRESHED'))
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

async function refreshAssetsManually() {
    try {
        const response = await cryptoApi.post('/refresh-popular-assets-manually');
        if (response.status !== 200) {
            return
        }
        await getPopularAssets()
    } catch (error) {
        console.error("Error while refreshing popular assets manually", error)
    }
}

async function getPopularAssets() {
    const data = await fetchPopularAssets()
    if (data?.assets) {
        popularAssets.value = normalizePopularAssets(data.assets)
    }
}

onBeforeMount(async () => {
    await getPopularAssets();
})

</script>

<style scoped>
h3 {
    color: var(--text-h-blue);
    margin-top: 2rem;
}

.refresh-assets-header {
    display: flex;
    justify-content: flex-end;
}
</style>