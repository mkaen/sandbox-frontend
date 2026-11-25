<template>
    <h1>{{ t('CRYPTO.VALUE') }}</h1>
    <p>{{ t('CRYPTO.INTRO') }}</p>
    <hr/>
    <h3>{{ t('FEAR_AND_GREED_INDEX') }}</h3>
    <FearAndGreedIndex
        :updated-at="fearAndGreedData.updatedAt"
        :value="fearAndGreedData.value"
        :sentiment="fearAndGreedData.sentiment"
        @refresh="refreshFearAndGreedIndexManually"
    />
    <hr/>
    <h3>{{ t('POPULAR_ASSETS') }}</h3>
    <PopularAssetsTable :popular-assets="popularAssets" @refresh="refreshAssetsManually" />
</template>


<script setup>
import { useI18n } from 'vue-i18n';
import { useToast } from '@/utils/toastUtils';
import { cryptoApi } from '@/config/api';
import { onBeforeMount, reactive, ref } from 'vue';
import PopularAssetsTable from '@/features/crypto/PopularAssetsTable.vue';
import { SENTIMENT, POPULAR_ASSET_MANUAL_REFRESH_TIME, FEAR_AND_GREED_INDEX_REFRESH_TIME } from '@/constants/constants';
import FearAndGreedIndex from '@/features/crypto/FearAndGreedIndex.vue';

const {t} = useI18n();
const toast = useToast();


const popularAssets = ref([]);
const fearAndGreedData = reactive({
    updatedAt: '',
    value: null,
    sentiment: null,
});

const VALID_SENTIMENT_CODES = new Set(Object.values(SENTIMENT));

function normalizeFearAndGreedIndex(payload) {
    if (!payload || typeof payload !== 'object') {
        return null;
    }

    const sentiment =
        typeof payload.sentiment === 'string' && VALID_SENTIMENT_CODES.has(payload.sentiment)
            ? payload.sentiment
            : null;

    const value =
        typeof payload.value === 'number'
        && Number.isFinite(payload.value)
        && payload.value >= 0
        && payload.value <= 100
            ? payload.value
            : null;

    const updatedAt = typeof payload.updatedAt === 'string' ? payload.updatedAt : '';

    if (sentiment === null && value === null && !updatedAt) {
        return null;
    }

    return { updatedAt, value, sentiment };
}

async function fetchPopularAssets() {
    try {
        const response = await cryptoApi.get('/popular-assets');
        if (response.status !== 200) {
            toast.makeErrorToast(t('ERRORS.GENERAL'))
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

async function refreshAssetsManually() {
    try {
        const response = await cryptoApi.post('/refresh-popular-assets-manually', null, {
            silentErrorStatuses: [429],
        });
        if (response.status !== 200) {
            return
        }
        await getPopularAssets();
        toast.makeSuccessToast(t('CRYPTO.ASSETS_REFRESHED'));
    } catch (error) {
        if (error.response?.status === 429) {
            const responseData = error.response?.data;
            const notificationCode = responseData?.notificationCode;
            toast.makeErrorToast(t(`${notificationCode}`, {cooldown_minutes: POPULAR_ASSET_MANUAL_REFRESH_TIME}));
        }
        console.error("Error while refreshing popular assets manually", error);
    }
}

async function refreshFearAndGreedIndexManually() {
    try {
        const response = await cryptoApi.post('/refresh-fear-and-greed', null, {
            silentErrorStatuses: [429],
        });
        if (response.status !== 200) {
            return
        }
        setFearAndGreedIndexValues(response.data);
        toast.makeSuccessToast(t('CRYPTO.FEAR_AND_GREED_INDEX_REFRESHED'));
    } catch (error) {
        if (error.response?.status === 429) {
            const responseData = error.response?.data;
            const notificationCode = responseData?.notificationCode;
            toast.makeErrorToast(t(`${notificationCode}`, {cooldown_minutes: FEAR_AND_GREED_INDEX_REFRESH_TIME}));
        }
        console.error("Error while refreshing popular assets manually", error);
    }
}

async function getPopularAssets() {
    const data = await fetchPopularAssets()
    if (data?.assets) {
        popularAssets.value = normalizePopularAssets(data.assets)
    }
}

async function fetchFearAndGreedIndex() {
    try {
        const response = await cryptoApi.get('/fear-and-greed-index');
        if (response.status !== 200) {
            return
        }
        setFearAndGreedIndexValues(response.data);
    } catch (error) {
        console.error("Fetching Fear and Greed Index data failed", error)
    }
};

function setFearAndGreedIndexValues(data) {
    const normalized = normalizeFearAndGreedIndex(data);
        if (!normalized) {
            return;
        }
        fearAndGreedData.updatedAt = normalized.updatedAt;
        fearAndGreedData.value = normalized.value;
        fearAndGreedData.sentiment = normalized.sentiment;
}

onBeforeMount(async () => {
    await getPopularAssets();
    await fetchFearAndGreedIndex();
})

</script>

<style scoped>
h3 {
    color: var(--text-h-blue);
    margin-top: 2rem;
}
</style>