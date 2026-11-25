
// Zone borders follow the Fear & Greed index scale (0-100), as fractions of the axis.
const GAUGE_ZONE_COLORS = [
    [0.25, '#FF6E76'], // extreme fear
    [0.45, '#FDDD60'], // fear
    [0.55, '#7c7272'], // neutral
    [0.75, '#58D9F9'], // greed
    [1, '#7CFFB2'], // extreme greed
];

// ECharts draws on a canvas and cannot resolve `var(--...)`, so read the computed colour.
function getAxisLabelColor() {
    return getComputedStyle(document.documentElement).getPropertyValue('--text-h-blue').trim();
}

export function buildFearAndGreedOption({ value, sentimentLabel }) {
    return {
        series: [
            {
                type: 'gauge',
                startAngle: 180,
                endAngle: 0,
                center: ['50%', '75%'],
                radius: '100%',
                min: 0,
                max: 100,
                splitNumber: 4,
                axisLine: {
                    lineStyle: {
                        width: 6,
                        color: GAUGE_ZONE_COLORS,
                    },
                },
                pointer: {
                    icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
                    length: '12%',
                    width: 13,
                    offsetCenter: [0, '-60%'],
                    itemStyle: {
                        color: 'auto',
                    },
                },
                axisTick: {
                    length: 10,
                    lineStyle: {
                        color: 'auto',
                        width: 2,
                    },
                },
                splitLine: {
                    length: 17,
                    lineStyle: {
                        color: 'auto',
                        width: 3,
                    },
                },
                axisLabel: {
                    color: getAxisLabelColor(),
                    fontSize: 15,
                    distance: -55,
                },
                title: {
                    color: 'inherit',
                    offsetCenter: [0, '-5%'],
                    fontSize: 18,
                },
                detail: {
                    fontSize: 30,
                    offsetCenter: [0, '-25%'],
                    valueAnimation: true,
                    formatter: (gaugeValue) => String(Math.round(gaugeValue)),
                    color: 'inherit',
                },
                data: [
                    {
                        value,
                        name: sentimentLabel,
                    },
                ],
            },
        ],
    };
}
