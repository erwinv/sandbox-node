import { range } from './util'

test('range', () => {
  expect([...range(1, 0)]).toEqual([])
  expect([...range(0, 1)]).toEqual([0])
  expect([...range(0, 10)]).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
})
