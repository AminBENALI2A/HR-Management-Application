import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { Users } from './entities/Users';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'adminpassword',
      database: 'hr_management',
      entities: [__dirname + '/entities/*.js'],  // or .ts if using ts-node
      synchronize: false,  // set to false in production!
      logging: true,      // optional, shows SQL logs in console
    }),
    AuthModule,
    UsersModule
  ],
})
export class AppModule {}