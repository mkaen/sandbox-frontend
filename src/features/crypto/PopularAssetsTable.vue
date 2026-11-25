<template>
    <div class="popular-assets">
        <div v-if="userStore.isAdmin" class="popular-assets-actions">
            <ConfirmationButton
                :label="t('REFRESH_MANUALLY')"
                variant="success"
                :title="refreshTitle"
                @click="emit('refresh')"
            />
        </div>
        <div class="table-card">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th scope="col"/>
                        <th scope="col">{{ t('CRYPTO.CURRENCY') }}</th>
                        <th scope="col">{{ t('CRYPTO.RANK') }}</th>
                        <th scope="col">{{ t('PRICE') }}</th>
                        <th scope="col">{{ t('CRYPTO.ATH_CHANGE') }}</th>
                        <th scope="col">{{ t('CRYPTO.24H_CHANGE') }}</th>
                        <th scope="col">{{ t('CRYPTO.MARKET_CAP') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="asset in popularAssets" :key="asset.currency" :title="formatUpdatedAt(asset.updatedAt)">
                        <td><img :src="asset.imageThumb" alt="asset"></td>
                        <td>{{ asset.currency }}</td>
                        <td>{{ asset.marketCapRank }}</td>
                        <td>$ {{ asset.priceUsd }}</td>
                        <td :class="asset.athChange >= 0 ? 'pos' : 'neg'">% {{ asset.athChange }}</td>
                        <td :class="asset.change24h >= 0 ? 'pos' : 'neg'">{{ asset.change24h }} %</td>
                        <td>$ {{ asset.marketCapUsd }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>


<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import ConfirmationButton from '@/components/buttons/ConfirmationButton.vue';
import { POPULAR_ASSET_MANUAL_REFRESH_TIME } from '@/constants/constants';
import { useUserStore } from '@/features/users/userStore';
import { formatUpdatedAt as formatUpdatedAtValue } from '@/utils/formatter';

const emit = defineEmits(['refresh']);

const { t, locale } = useI18n();
const userStore = useUserStore();

const refreshTitle = computed(() =>
    t('ASSET_MANUAL_REFRESH_TIMEOUT', { cooldown_minutes: POPULAR_ASSET_MANUAL_REFRESH_TIME }),
);

function formatUpdatedAt(updatedAt) {
  return formatUpdatedAtValue(updatedAt, locale.value, t('UPDATED_AT'));
}

defineProps({
    popularAssets: Array
})


</script>

<style scoped>
.popular-assets-actions {
    display: flex;
    justify-content: flex-end;
}

.pos {
    color: green
}
.neg {
    color: red;
}
</style>
