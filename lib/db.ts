import { knex } from 'knex'
import { env } from 'process'

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
  await Promise.all([mysql.destroy(), pg.destroy(), sqlite.destroy()])
}
