import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import configuration from "../configuration";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { BetterSqlite3ConnectionOptions } from "typeorm/driver/better-sqlite3/BetterSqlite3ConnectionOptions";

const baseConfig: TypeOrmModuleOptions = {
  entities: ["dist/database/entities/*.js"],
  synchronize: configuration.DB.SYNCHRONIZE,
  cache: true,
  namingStrategy: new SnakeNamingStrategy(),
  migrationsRun: !configuration.DB.SYNCHRONIZE,
  logging: configuration.DB.DEBUG,
};

const postgresConfig: PostgresConnectionOptions = {
  type: "postgres",
  host: configuration.DB.HOST,
  port: configuration.DB.PORT,
  username: configuration.DB.USERNAME,
  password: configuration.DB.PASSWORD,
  database: configuration.DB.DATABASE,
  migrations: ["dist/database/migrations/postgres/*.js"],
};

const sqliteConfig: BetterSqlite3ConnectionOptions = {
  type: "better-sqlite3",
  migrations: ["dist/database/migrations/sqlite/*.js"],
  database: configuration.TESTING.IN_MEMORY_DB
    ? ":memory:"
    : `${configuration.VOLUMES.SQLITEDB}/database.sqlite`,
};

export function getDatabaseConfiguration(): TypeOrmModuleOptions {
  switch (configuration.DB.SYSTEM) {
    case "SQLITE":
      return { ...baseConfig, ...sqliteConfig } as TypeOrmModuleOptions;
    case "POSTGRESQL":
      return { ...baseConfig, ...postgresConfig } as TypeOrmModuleOptions;
    default:
      return { ...baseConfig, ...postgresConfig } as TypeOrmModuleOptions;
  }
}
