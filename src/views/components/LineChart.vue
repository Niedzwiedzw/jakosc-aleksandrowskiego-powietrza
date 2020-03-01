<template>
  <div class="LineChart">
    <canvas width="1200" height="400" id="data-canvas"></canvas>
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
    },
    setup(props) {
        onMounted(() => {
            const canvas = document.getElementById('data-canvas') as HTMLCanvasElement;  // TODO: this won't work for multiple canvas
            new Chart(canvas, {
                type: 'line',
                data: buildMultiLineChartData(props.data),
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                            }
                        }]
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