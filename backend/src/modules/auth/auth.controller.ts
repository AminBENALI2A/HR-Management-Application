import { Controller, Get, Post, Body, Res, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../../dto/login.dto';
import type { Response } from 'express';
import { AuthGuard } from '../../guards/auth.guard';

import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    email: string;
    role: string;
  };
}
@Controller('/api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Get('health')
  async healthCheck() {
    return this.authService.runningCheck();
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const status = await this.authService.login(loginDto, res);
    return {
      message: 'Login successful',
      status,
    };
  }


  @Post('forgot-password')
    async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
    }

  @Post('reset-password')
    async resetPassword(@Body() body: { token: string; newPassword: string }) {
    return this.authService.resetPassword(body.token, body.newPassword);
    }
  @Get('session')
  @UseGuards(AuthGuard)
  checkSession(@Req() req: AuthenticatedRequest) {
    return {
      isAuthenticated: true,
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
      },
    };
  }
}