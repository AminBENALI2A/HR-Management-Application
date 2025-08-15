import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersModule } from './modules/users/users.module';
import { join } from 'path';
import { readFileSync } from 'fs';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Explicitly specify the env file
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'hr-management-optymum.cqbu0goc27gf.us-east-1.rds.amazonaws.com',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'hrmanagement',
      password: process.env.DB_PASSWORD || 'hrmanagement',
      database: process.env.DB_NAME || 'hr_management',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      ssl: {
        ca: readFileSync(join(__dirname, 'global-bundle.pem')).toString(),
        rejectUnauthorized: true
      },
      extra: {
        ssl: {
          require: true,
        }
      },
      synchronize: false,
      logging: true,
    }),
    AuthModule,
    UsersModule
  ],
})
export class AppModule {}