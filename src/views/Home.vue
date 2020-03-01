<template>
  <div class="Home">
    <h3 class="heading">Jakość Aleksandrowskiego powietrza</h3>
    <line-chart :data="chartData" class="chart"/>
  </div>
</template>

<script lang="ts">
import {defineComponent} from '@vue/composition-api';
import LineChart from "@/views/components/LineChart.vue";
import {entries, Entry} from '@/data';
import {keyBy, map} from 'lodash';
import {buildMultiLineChartData} from "@/chart-helpers";
export default defineComponent({
    components: {
      LineChart,
    },
    name: 'Home',
    props: {},
    setup() {
        const toDataChunk = (e: Entry) => ({
            'czas': e.timeRaw,
            // 'PM1': e.pm1,
            // 'PM10': e.pm10,
            'PM25': e.pm25,
        });
        const data = map(entries, toDataChunk);
        const chartData = keyBy(data, 'czas');
        return {
            chartData,
        };
    },
})
</script>

<style scoped lang="scss">
  @import '../../styles';

  @mixin height($fraction) {
    height: 100vh * $fraction;
  }

  .Home {
    @include grid-center;
    grid-auto-rows: min-content;
    .heading {
      @include grid-center;
      text-align: center;
      background-color: $dark;
      color: $white;
    }

    .chart {
      @include height(.5);
    }
  }
</style>
