// import data from '@/data/2708-_2018-03-07_2020-02-20_results (1).csv';
import csv_ from '!!raw-loader!./data/2708-_2018-03-07_2020-02-20_results (1).csv';
import Papa from 'papaparse';
import { map, zip, fromPairs, split, last, isEmpty, isNil, filter, keyBy, omit, mapValues } from 'lodash';
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
    public constructor(public raw: DataEntryRaw) {}
    public get pm1() { return nonEmpty(this.raw.pm1); }
    public get pm10() { return nonEmpty(this.raw.pm10); }
    public get pm25() { return nonEmpty(this.raw.pm25); }
    public get temperature() { return nonEmpty(this.raw.temperature); }
    public get humidity() { return nonEmpty(this.raw.humidity); }
    public get pressure() { return nonEmpty(this.raw.pressure); }
    public get timeRaw() { return this.raw['UTC time']; }
    public get time(): moment.Moment { return moment(this.raw['UTC time']); }
    public get timePretty(): string { return this.time.format('LLL'); }
    public get pm10norm(): number | null { return this.pm10 === null ? null : (this.pm10 / PM10_NORM); }
    public get pm25norm(): number | null { return this.pm25 === null ? null : (this.pm25 / PM25_NORM); }
}

function valid(e: Entry): boolean {
    return !isNil(e.pm1) &&
        !isNil(e.pm10) &&
        !isNil(e.pm25) &&
        !isNil(e.temperature)
}

const lines = filter(Papa.parse(csv).data, (line, index) => index % 1 === 0);
const header = map(lines[0], (h) => last(split(h, '_')) ?? h);
const entriesRaw = map(lines.slice(1), (l) => fromPairs(zip(header, l))) as DataEntryRaw[];
export const entries = filter(map(entriesRaw, (e) => new Entry(e)), valid);

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
