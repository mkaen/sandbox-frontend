<template>
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
                <tr v-for="asset in popularAssets" :key="asset.currency">
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
</template>


<script setup>
import { useI18n } from 'vue-i18n';

const {t} = useI18n();

defineProps({
    popularAssets: Array
})


</script>

<style scoped>
.pos {
    color: green
}
.neg {
    color: red;
}
</style>
