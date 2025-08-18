import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersModule } from './modules/users/users.module';
import { Users } from './entities/Users';
import { PasswordResetToken } from './entities/PasswordResetToken';
import { PartenairesModule } from './modules/partenaires/partenaires.module';
import { Partenaires } from './entities/Partenaires';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Explicitly specify the env file
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Users, PasswordResetToken, Partenaires],
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      synchronize: false,
      logging: process.env.NODE_ENV === 'development' ? true : ['error'],
    }),
    AuthModule,
    UsersModule,
    PartenairesModule
  ],
})
export class AppModule {}