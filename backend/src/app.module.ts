import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { Users } from './entities/Users';
import { UsersModule } from './modules/users/users.module';
import { join } from 'path';
import { readFileSync } from 'fs';

@Module({
  imports: [ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER || 'admin',
      password: process.env.DB_PASSWORD || 'adminpassword',
      database: process.env.DB_NAME || 'hr_management',
      entities: [__dirname + '/entities/*.js'],  // use .ts if running ts-node locally
      ssl: {
        ca: readFileSync("../global-bundle.pem"),
        rejectUnauthorized: true
      },
      extra: {
        ssl: {
          require: true,
        }
      },
      synchronize: false,  // keep false in production
      logging: true,
    }),
    AuthModule,
    UsersModule
  ],
})
export class AppModule {}