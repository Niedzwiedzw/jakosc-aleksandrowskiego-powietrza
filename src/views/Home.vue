<template>
  <div class="Home">
    <h3 class="heading">Jakość Aleksandrowskiego powietrza</h3>
    <line-chart
        v-for="[month, chartData] of chartDataByMonth"
        :key="month"
        :data="chartData"
        :title="month"
        class="chart"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent} from '@vue/composition-api';
import LineChart from "@/views/components/LineChart.vue";
import {AnyKindOfDictionary, entries, dailyAvg, Entry, keyByAndOmit} from '@/data';
import {groupBy, map, entries as _entries} from 'lodash';
import {buildMultiLineChartData, ChartData} from "@/chart-helpers";

interface ChartFormattedEntry {
    czas: string;
    'PM 10 (% normy)': number | null;
    'PM 2.5 (% normy)': number | null;
}

export default defineComponent({
    components: {
        LineChart,
    },
    name: 'Home',
    props: {},
    setup() {
        const byMonth = _entries(groupBy(dailyAvg, (e) => `${e.time.month() + 1}/${e.time.year()}`));
        const toDataChunk = (e: Entry) => ({
            'czas': e.timePretty,
            // 'PM1': e.pm1,
            'PM 10 (% normy)': e.pm10,
            'PM 2.5 (% normy)': e.pm25,
        } as ChartFormattedEntry);
        const dataByMonth: [string, ChartFormattedEntry[]][] = map(byMonth, ([month, monthEntries]) => [month, map(monthEntries, toDataChunk)]); // [month, monthlyData]
        const chartDataByMonth = map(dataByMonth, ([month, data]) => [month, keyByAndOmit(data as unknown as AnyKindOfDictionary[], 'czas')]) as [string, Partial<ChartFormattedEntry>[]];
        return {
            chartDataByMonth,
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
    }
  }
</style>
