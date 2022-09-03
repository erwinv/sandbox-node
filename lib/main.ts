import { range } from './util'

export async function main() {
  for (const i of range(0, 3)) {
    console.info('hello', i)
  }
}
