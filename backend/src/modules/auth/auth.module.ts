import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Users } from '../../entities/Users';
import { PasswordResetToken } from '../../entities/PasswordResetToken';
import { MailModule } from '../mail/mail.module';
import { PasswordResetService } from './password-reset.service'; // ✅ Import if in same folder

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, PasswordResetToken]),
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
      }),
    }),
    MailModule,
  ],
  providers: [AuthService, PasswordResetService], // ✅ Add service here
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}

