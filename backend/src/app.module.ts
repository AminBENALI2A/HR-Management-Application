import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Explicitly specify the env file
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'hr-management-optymum.cqbu0goc27gf.us-east-1.rds.amazonaws.com',
      port: 5432,
      username: 'hrmanagement',
      password: 'hrmanagement',
      database: 'hr_management',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      ssl: {
        rejectUnauthorized: false
      },
      synchronize: false,
      logging: true,
    }),
    AuthModule,
    UsersModule
  ],
})
export class AppModule {}