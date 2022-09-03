import { main } from './main'

test('main', async () => {
  await expect(main()).resolves.toBe(0)
})
