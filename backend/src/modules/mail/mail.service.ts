import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',      // your SMTP server
      port: 587,                     // SMTP port
      secure: false,                 // true for 465, false for other ports
      auth: {
        user: 'aminebenaliroo@gmail.com',
        pass: 'cddluwaxwvvhbciq',
      },
    });
  }

  async sendResetEmail(to: string, resetUrl: string) {
    const mailOptions = {
      from: '"HR-Management" <no-reply@hr-management.com>',
      to,
      subject: 'Password Reset Request',
      html: `
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>If you didn’t request this, please ignore this email.</p>
      `,
    };
    console.log('Sending reset email to:', to);

    return this.transporter.sendMail(mailOptions);
  }
}
