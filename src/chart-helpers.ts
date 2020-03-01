import {
    values, zip, take,
    first, isNil,
    map, keys, cloneDeep,
    reverse, filter,
} from 'lodash';
import moment from 'moment';
import {Dictionary, Entry} from "@/data";

moment.locale('pl');

export const COLOURS_PRIMARY = {
    black: '#4f5859',
    blue: '#00add8',
    orangered: '#e15829',
    orange: '#ff9e16',
};

export const COLOURS_LIGHT = {
    beige: '#f7d5c9',
    gray: '#d3d5d5',
    gold: '#ffe7c5',
    blue: '#bfeaf5',
    green: '#e5f5bf',
};

export const COLOURS_MEDIUM = {
    green: '#cbeb7f',
    blue: '#7fd6eb',
    orange: '#ffce8a',
    orangered: '#f0ab94',
    gray: '#a7abac',
};

export const ALL_COLOURS = [...values(COLOURS_MEDIUM), ...values(COLOURS_LIGHT), ...values(COLOURS_PRIMARY)];
export const MORE_COLOURS = [...ALL_COLOURS, ...ALL_COLOURS, ...ALL_COLOURS, ...ALL_COLOURS, ...ALL_COLOURS];


export function reversed<T>(array: T[]): T[] {
    return reverse(cloneDeep(array));
}

export function formatTime(input: string): string {
    return moment(input).toISOString();
}

export function tryFormatTime(val: string): string {
    try {
        const newVal = formatTime(val);
        if (!isNil(newVal) && Boolean(newVal)) {
            return newVal;
        }
    } catch (e) {
        (() => (1 + 1))();
    }
    return val;
}

export type ChartData = { [key: string]: { [key: string]: number }};

export function buildMultiLineChartData(data: ChartData, colours = MORE_COLOURS) {
    const bottomLabels = keys(data); // this is reversed...
    const subsetNames = keys(first(values(data))!);

    return cloneDeep({
        labels: map(bottomLabels, tryFormatTime),
        datasets: map(
            zip(subsetNames, take(colours, subsetNames.length)),
            ([subsetName, colour]) => ({
                data: map(values(data), (subset) => subset[subsetName!]), // ...because this is reversed
                label: subsetName!,
                borderColor: colour!,
            }),
        ),
    });
}
export interface ChartFormattedEntry {
    czas: string;
    'PM 10 (% normy)': number | null;
    'PM 2.5 (% normy)': number | null;
}

export function aboveAverageCount(entries: Dictionary<ChartFormattedEntry>): number {
    return filter(values(entries), (e) => (e['PM 10 (% normy)'] ?? 0) > 100 || (e['PM 2.5 (% normy)'] ?? 0) > 100).length
}

export function periodSummary(entries: Dictionary<ChartFormattedEntry>): string {
    const [count, all] = [aboveAverageCount(entries), values(entries).length];
    return count > 0
        ? ` - w ${count} spośród ${all} zmierzonych dni, normy prawdopodobnie zostały przekroczone (${(count/all)*100}% miesiąca)`
        : ''
}

