// src/knexfile.ts
import { Knex } from 'knex';

const knexConfig: Knex.Config = {
  client: 'pg',
  connection: {
    connectionString: 'postgresql://db_owner:oBrpnv7hiCL2@ep-orange-resonance-a5kr1kfn.us-east-2.aws.neon.tech/db?sslmode=require',
  },
  pool: { min: 0, max: 10 },
  migrations: {
    tableName: 'knex_migrations',  // You can configure the migrations table name if needed
    directory: './src/migrations', // Path to your migrations directory
  },
  seeds: {
    directory: './src/seeds', // Path to your seeds directory
  },
};

export default knexConfig;
