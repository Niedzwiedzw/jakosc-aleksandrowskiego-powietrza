// import data from '@/data/2708-_2018-03-07_2020-02-20_results (1).csv';
import csv_ from '!!raw-loader!./data/2708-_2018-03-07_2020-02-20_results (1).csv';
import Papa from 'papaparse';
import {
    map,
    zip,
    fromPairs,
    split,
    last,
    isEmpty,
    isNil,
    filter,
    keyBy,
    omit,
    mapValues,
    groupBy,
    values,
    reduce,
} from 'lodash';
import {Data} from "@vue/composition-api/dist/component";

const csv = csv_ as string;
import moment from 'moment';

moment.locale('pl');

interface DataEntryRaw {
    'UTC time': string;
    pm1: string;
    pm25: string;
    pm10: string;
    temperature: string;
    humidity: string;
    pressure: string;
}

function nonEmpty(input: string): number | null {
    input = input.replace(' ', '');
    return input.length === 0 ? null : parseFloat(input);
}

const PM25_NORM = 25;  // source: https://kobieta.onet.pl/zdrowie/pyl-zawieszony-pm10-i-pm25-normy-i-szkodliwosc-maska-przeciwpylowa/nw99lmy?utm_source=duckduckgo.com_viasg_kobieta&utm_medium=referal&utm_campaign=leo_automatic&srcc=ucs&utm_v=2 XDD
const PM10_NORM = 50;  // source: https://kobieta.onet.pl/zdrowie/pyl-zawieszony-pm10-i-pm25-normy-i-szkodliwosc-maska-przeciwpylowa/nw99lmy?utm_source=duckduckgo.com_viasg_kobieta&utm_medium=referal&utm_campaign=leo_automatic&srcc=ucs&utm_v=2 XDDD

export class Entry {
    public constructor(
        public pm1: number | null,
        public pm10: number | null,
        public pm25: number | null,
        public temperature: number | null,
        public pressure: number | null,
        public timeRaw: string,
    ) {
    }

    public static fromRaw(raw: DataEntryRaw): Entry {
        return new Entry(
            nonEmpty(raw.pm1),
            nonEmpty(raw.pm10),
            nonEmpty(raw.pm25),
            nonEmpty(raw.temperature),
            nonEmpty(raw.pressure),
            raw["UTC time"],
        );
    }

    public get time(): moment.Moment {
        return moment(this.timeRaw);
    }

    public get timePretty(): string {
        return this.time.format('LL');
    }

    public get pm10norm(): number | null {
        return this.pm10 === null ? null : (this.pm10 / PM10_NORM);
    }

    public get pm25norm(): number | null {
        return this.pm25 === null ? null : (this.pm25 / PM25_NORM);
    }

    public add(other: Entry): Entry {  // only usable for cleaned-data (no nulls)
        return new Entry(
            this.pm1! + other.pm1!,
            this.pm10! + other.pm10!,
            this.pm25! + other.pm25!,
            this.temperature! + other.temperature!,
            this.pressure! + other.pressure!,
            this.timeRaw,
        );
    }

    public mult(scalar: number): Entry {  // only usable for cleaned data (no nulls)
        return new Entry(
            this.pm1! * scalar,
            this.pm25! * scalar,
            this.pm10! * scalar,
            this.temperature! * scalar,
            this.pressure! * scalar,
            this.timeRaw,
        )
    }
}

function valid(e: Entry): boolean {
    return !isNil(e.pm1) &&
        !isNil(e.pm10) &&
        !isNil(e.pm25) &&
        !isNil(e.temperature) &&
        !isNil(e.pressure)
}

const lines = Papa.parse(csv).data;
const header = map(lines[0], (h) => last(split(h, '_')) ?? h);
const entriesRaw = map(lines.slice(1), (l) => fromPairs(zip(header, l))) as DataEntryRaw[];
export const entries = filter(map(entriesRaw, Entry.fromRaw), valid);
export const dailyAvg = map(
    values(groupBy(entries, (e) => `${e.time.year()}-${e.time.month()}-${e.time.dayOfYear()}`)),
    (singleDay: Entry[]) => reduce(singleDay.slice(1), (result, value) => result.add(value), singleDay[0]).mult(1 / singleDay.length),
);

// Crazy typedef needed get _.omit to work properly with Dictionary and NumericDictionary
export interface NumericDictionary<T> {
    [index: number]: T;
}

export interface Dictionary<T> {
    [index: string]: T;
}

export type AnyKindOfDictionary =
    | Dictionary<{} | null | undefined>
    | NumericDictionary<{} | null | undefined>;


export function keyByAndOmit<T extends AnyKindOfDictionary>(collection: Array<T>, key: string | number): { [key: string]: Pick<T, Exclude<keyof T, string | number>> } {
    return mapValues(keyBy(collection, key), (v) => omit(v, key));
}
