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
import { PasswordResetService } from './password-reset.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, PasswordResetToken]),
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || "a09a1618486172ff2338d24885361e72e72ae0520b9f024e1b4d7309290b55ded92a270446794e18d87d3c6056f6a837",
        signOptions: { 
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || "1h" 
        },
      }),
    }),
    MailModule,
  ],
  providers: [AuthService, PasswordResetService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}