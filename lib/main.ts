import 'dotenv/config'
import { range } from './util'
import { mysql, pg, sqlite, teardown } from './db'

export async function main() {
  try {
    for (const i of range(0, 3)) {
      console.info('hello', i)
    }

    const tracks = await sqlite
      .from('Track')
      .select('Name', 'Composer')
      .limit(10)
    console.table(tracks)

    const users = await pg
      .from('api_user')
      .select('first_name', 'last_name')
      .offset(0)
      .limit(10)
    console.table(users)

    const pets = await mysql
      .from('pet')
      .select('name', 'species')
      .offset(0)
      .limit(10)
    console.table(pets)

    return 0
  } finally {
    await teardown()
  }
}
