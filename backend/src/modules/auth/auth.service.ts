import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Users } from '../../entities/Users';
import { LoginDto } from '../../dto/auth.dto/login.dto';
import type { Response } from 'express';
import { randomBytes } from 'crypto';
import { PasswordResetService } from './password-reset.service';
import { MailService } from '../mail/mail.service';
import { API_BASE_URL } from '../../config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private jwtService: JwtService,
    private passwordResetService: PasswordResetService,
    private readonly mailService: MailService,
  ) {}
  async runningCheck() {
    return { status: 'running' };
  }
  async login(loginDto: LoginDto, res: Response) {
    console.log('Logging in...');
    const user = await this.usersRepository.findOneBy({ email: loginDto.email });
    if (!user) {
      console.log('User not found:', loginDto.email);
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!passwordValid) {
      console.log('Invalid password for user:', user.email);
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.active) {
      console.log('User is inactive:', user.email);
      throw new UnauthorizedException('Invalid email or password');
    }
    console.log('Found user:', user.email);

    // Create JWT payload with relevant info
    const payload = { sub: user.id, email: user.email, active: user.active };

    res.cookie('access_token', this.jwtService.sign(payload), {
        httpOnly: true,       // Not accessible by JavaScript
        secure: true,         // Only over HTTPS
        sameSite: 'lax',   // Mitigate CSRF
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    });


    return {
        user: {
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        telephone: user.telephone,
        role: user.role,
        active: user.active,
        }
    };
    }


  async forgotPassword(email: string) {
        const user = await this.usersRepository.findOneBy({ email });
        if (!user) {
          console.log('User not found for email:', email);
          return { message: 'If that account exists, we sent a password reset email.' };
        }
        const rawToken = randomBytes(32).toString('hex');
        const expiresAt = Date.now() + 15 * 60 * 1000;

        await this.passwordResetService.create(user.id, rawToken, expiresAt);

        const resetUrl = `${API_BASE_URL}/reset-password?token=${rawToken}`;

        await this.mailService.sendResetEmail(user.email, resetUrl);

        return { message: 'If that account exists, we sent a password reset email.' };
    }

  async resetPassword(token: string, newPassword: string) {
        if (!newPassword) {
            throw new Error('New password is required');
        }

        const record = await this.passwordResetService.verifyToken(token);
        if (!record) {
            throw new Error('Invalid or expired token');
        } 

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.usersRepository.update(record.userId, { passwordHash: hashedPassword });
        await this.passwordResetService.delete(record.id);

        return { message: 'Password reset successful' };
    }
  async validateToken(token: string) {
        try {
          // Verify token signature and expiration
          const payload = this.jwtService.verify(token);
          
          // Validate payload - ensure 'sub' exists and is a number
          if (payload.sub === undefined || typeof payload.sub !== 'number') {
            throw new UnauthorizedException('Invalid token payload');
          }

          // Find user (TypeORM will automatically convert number ID)
          const user = await this.usersRepository.findOne({
            where: { id: payload.sub },
            select: ['id', 'role', 'active'] // Only select needed fields
          });

          // User validation
          if (!user) {
            throw new UnauthorizedException('Invalid email or password');
          }
          
          if (!user.active) {
            throw new UnauthorizedException('Invalid email or password');
          }

          return user;
        } catch (err) {
          // Handle specific JWT errors
          if (err.name === 'TokenExpiredError') {
            throw new UnauthorizedException('Token expired');
          }
          if (err.name === 'JsonWebTokenError') {
            throw new UnauthorizedException('Invalid token');
          }
          // Generic error for all other cases
          throw new UnauthorizedException('Authentication failed');
        }
      }

}

