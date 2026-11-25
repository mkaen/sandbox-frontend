<template>
    <div class="fear-and-greed-card" :title="updatedAtTitle">
        <div ref="chartContainer" class="fear-and-greed-chart" aria-hidden="true"></div>
        <p class="visually-hidden">{{ chartSummary }}</p>
        <div v-if="userStore.isAdmin" class="fear-and-greed-actions">
            <ConfirmationButton
                :label="t('REFRESH_MANUALLY')"
                variant="success"
                :title="refreshTitle"
                @click="emit('refresh')"
            />
        </div>
    </div>
</template>


<script setup>
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { init, use } from 'echarts/core';
import { GaugeChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { formatUpdatedAt } from '@/utils/formatter';
import ConfirmationButton from '@/components/buttons/ConfirmationButton.vue';
import { FEAR_AND_GREED_INDEX_REFRESH_TIME } from '@/constants/constants';
import { useUserStore } from '@/features/users/userStore';
import { buildFearAndGreedOption } from '@/features/crypto/scripts/fearAndGreedIndicator';

const emit = defineEmits(['refresh']);

const userStore = useUserStore();

use([GaugeChart, CanvasRenderer]);

const { t, locale } = useI18n();

const props = defineProps({
    updatedAt: String,
    value: Number,
    sentiment: String,
});

const chartContainer = ref(null);
const chart = shallowRef(null);
let resizeObserver = null;

const sentimentLabel = computed(() => (props.sentiment ? t(`SENTIMENT.${props.sentiment}`) : ''));
const updatedAtTitle = computed(() => formatUpdatedAt(props.updatedAt, locale.value, t('UPDATED_AT')));
const chartSummary = computed(() => `${t('FEAR_AND_GREED_INDEX')}: ${props.value ?? ''} ${sentimentLabel.value}`.trim());
const refreshTitle = computed(() =>
    t('FEAR_AND_GREED_INDEX_REFRESH_LIMITED', {
        cooldown_minutes: FEAR_AND_GREED_INDEX_REFRESH_TIME,
    }),
);

function renderChart() {
    if (!chart.value || props.value === null || props.value === undefined) {
        return;
    }
    chart.value.setOption(
        buildFearAndGreedOption({ value: props.value, sentimentLabel: sentimentLabel.value }),
    );
}

onMounted(() => {
    chart.value = init(chartContainer.value);
    resizeObserver = new ResizeObserver(() => chart.value?.resize());
    resizeObserver.observe(chartContainer.value);
    renderChart();
});

onBeforeUnmount(() => {
    resizeObserver?.disconnect();
    chart.value?.dispose();
    chart.value = null;
});

watch(() => [props.value, sentimentLabel.value], renderChart);
</script>


<style scoped>
.fear-and-greed-card {
    max-width: 480px;
}

.fear-and-greed-chart {
    width: 100%;
    height: 280px;
}

.fear-and-greed-actions {
    display: flex;
    justify-content: center;
    margin-top: 0.5rem;
}
</style>
