<template>
  <div class="LineChart">
    <canvas width="1200" height="400" :id="title"></canvas>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted} from '@vue/composition-api';
import {Chart} from 'chart.js';
import {buildMultiLineChartData, ChartData} from "@/chart-helpers";

export default defineComponent({
    name: "LineChart",
    props: {
        data: {
            type: Object as () => ChartData,
            required: true,
        },
        title: {
            type: String,
            required: true,
        }
    },
    setup(props) {
        onMounted(() => {
            const canvas = document.getElementById(props.title) as HTMLCanvasElement;
            new Chart(canvas, {
                type: 'line',
                data: buildMultiLineChartData(props.data),
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                suggestedMin: 0,
                                suggestedMax: 600,
                            }
                        }]
                    },
                    title: {
                        display: true,
                        text: props.title,
                    }
                }
            });
        });
        return {}
    }

});
</script>

<style scoped lang="scss">
    .LineChart {

    }
</style>