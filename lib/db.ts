import { env } from 'process'
import IORedis, { Redis } from 'ioredis'
import { knex } from 'knex'

export const redis = new Proxy(
  new IORedis({
    host: env.REDIS_HOST ?? 'localhost',
    port: Number(env.REDIS_PORT ?? '6379'),
    username: env.REDIS_USER,
    password: env.REDIS_PASSWORD,
    db: Number(env.REDIS_DATABASE ?? '0'),
  }),
  {
    get(...args) {
      const [target, prop] = args
      if (prop === 'keys') {
        return async (...args: Parameters<Redis['keys']>) => {
          const [pattern] = args
          const allKeys = new Array<string>()
          for await (const keys of redisKeys(target, pattern)) {
            allKeys.push(...keys)
          }
          return [...new Set(allKeys).values()]
        }
      }
      return Reflect.get(...args)
    },
  }
)

export function redisKeys(
  redis: IORedis,
  match = '*',
  count = 10
): AsyncIterable<string[]> {
  let cursor: number | string = 0
  let keys = new Array<string>()
  return {
    [Symbol.asyncIterator]() {
      return {
        async next() {
          if (cursor === `${0}`) return { done: true, value: undefined }
          ;[cursor, keys] = await redis.scan(
            cursor,
            'MATCH',
            match,
            'COUNT',
            count
          )
          return { done: false, value: keys }
        },
      }
    },
  }
}

export const mysql = knex({
  client: 'mysql',
  connection: {
    host: env.MARIADB_HOST ?? 'localhost',
    port: Number(env.MARIADB_PORT ?? '3306'),
    user: env.MARIADB_USER,
    password: env.MARIADB_PASSWORD,
    database: env.MARIADB_DATABASE ?? 'test',
  },
})

export const pg = knex({
  client: 'pg',
  connection: {
    host: env.POSTGRES_HOST ?? 'localhost',
    port: Number(env.POSTGRES_PORT ?? '5432'),
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DATABASE ?? 'test',
  },
})

export const sqlite = knex({
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: env.SQLITE_DATABASE ?? ':memory:',
  },
})

export async function teardown() {
  await Promise.all([
    redis.quit(),
    mysql.destroy(),
    pg.destroy(),
    sqlite.destroy(),
  ])
}
