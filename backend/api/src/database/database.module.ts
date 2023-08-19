import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ENV_VAR } from "config";
import * as path from "path";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: ENV_VAR.DB_ENGINE,
        host: ENV_VAR.DB_HOST,
        port: ENV_VAR.DB_PORT,
        database: ENV_VAR.DB_NAME,
        username: ENV_VAR.DB_USER,
        password: ENV_VAR.DB_PASSWORD,
        entities: [path.join(__dirname, "/../**/*.entity{.ts,.js}")],
        migrations: [path.join(__dirname, "/migrations/*{.ts,.js}")],
        logging: ENV_VAR.DB_LOGGING,
        synchronize: false,
        migrationsRun: false,
        autoLoadEntities: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
