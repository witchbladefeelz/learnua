import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor() {
    const host = process.env.SMTP_HOST?.trim() || 'smtp.gmail.com';
    const port = parseInt(process.env.SMTP_PORT ?? '587', 10);
    const secure = process.env.SMTP_SECURE === 'true' || port === 465;
    const user = (process.env.SMTP_USER ?? 'koharuxmeow@gmail.com').trim();
    const pass = (process.env.SMTP_PASS ?? 'drpg dndd pgup zbab').replace(/\s+/g, '');

    if (!host || !user || !pass) {
      this.logger.warn('SMTP credentials are incomplete. Using defaults – update environment variables in production.');
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      service: host.includes('gmail') ? 'gmail' : undefined,
      auth: { user, pass },
    });

    this.verifyConnection();
  }

  async sendMail(options: nodemailer.SendMailOptions) {
    try {
      const defaultFrom = process.env.SMTP_FROM || `${process.env.SMTP_USER || 'koharuxmeow@gmail.com'}`;
      const from = options.from ?? defaultFrom;
      await this.transporter.sendMail({
        ...options,
        from,
      });
    } catch (error) {
      this.logger.error('Failed to send email', error instanceof Error ? error.stack : undefined);
      throw new InternalServerErrorException('Failed to send email');
    }
  }

  async sendVerificationEmail(to: string, token: string, name?: string) {
    const frontendUrl = process.env.EMAIL_VERIFICATION_URL ?? `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email`;
    const separator = frontendUrl.includes('?') ? '&' : '?';
    const verificationUrl = `${frontendUrl}${separator}token=${token}`;

    const subject = 'Verify your email for UAlearn';
    const displayName = name?.trim() || 'there';

    const text = `Hi ${displayName},\n\nPlease confirm your email address to activate your UAlearn account.\n\nVerify your email: ${verificationUrl}\n\nIf you didn't create an account, you can safely ignore this email.`;

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
        <h2 style="color: #0f172a;">Hi ${displayName},</h2>
        <p>Thank you for registering in UAlearn! Please confirm your email address to activate your account.</p>
        <p>
          <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background: #2563eb; color: #ffffff; border-radius: 8px; text-decoration: none; font-weight: 600;">
            Verify email
          </a>
        </p>
        <p style="font-size: 14px; color: #475569;">Or copy this link into your browser:</p>
        <p style="font-size: 14px; color: #2563eb; word-break: break-all;">${verificationUrl}</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="font-size: 12px; color: #94a3b8;">If you did not create this account, you can safely ignore this email.</p>
      </div>
    `;

    await this.sendMail({
      to,
      subject,
      text,
      html,
    });
  }

  private async verifyConnection() {
    try {
      await this.transporter.verify();
      this.logger.log('SMTP connection verified successfully');
    } catch (error) {
      this.logger.error('SMTP verification failed', error instanceof Error ? error.message : error);
    }
  }
}
