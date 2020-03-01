// import { shallowMount } from '@vue/test-utils'
// import HelloWorld from '@/components/HelloWorld.vue'
//
// describe('HelloWorld.vue', () => {
//   it('renders props.msg when passed', () => {
//     const msg = 'new message'
//     const wrapper = shallowMount(HelloWorld, {
//       propsData: { msg }
//     })
//     expect(wrapper.text()).toMatch(msg)
//   })
// })

import {Entry} from "@/data";
import moment from 'moment';

const newEntry = (pm1: number, pm10:  number, pm25: number, temperature: number, pressure: number, date: string = moment.now().toString()) => {
  return new Entry(pm1, pm10, pm25, temperature, pressure, date);
}

describe('Ensure scalar operations on Entries work properly', () => {
  it('adds entries properly', () => {
    expect(newEntry(0, 0, 0, 0, 0).pm1).toEqual(0);
    expect(newEntry(1, 0, 0, 0, 0).pm1).toEqual(1);
    expect(newEntry(1, 0, 0, 0, 0).add(newEntry(1, 0, 0, 0, 0)).pm1).toEqual(2);
  });

  it('handles multiplication propesly', () => {
    expect(newEntry(1, 1, 1, 1, 1).mult(2).pm1).toEqual(2);
  })
});
