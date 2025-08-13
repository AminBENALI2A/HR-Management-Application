import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { PasswordResetToken } from '../../entities/PasswordResetToken';
import { Cron, CronExpression } from '@nestjs/schedule';
@Injectable()
export class PasswordResetService {
  constructor(
    @InjectRepository(PasswordResetToken)
    private repo: Repository<PasswordResetToken>,
  ) {}

  async create(userId: number, rawToken: string, expiresAt: number) {
    const tokenHash = await bcrypt.hash(rawToken, 10);
    const record = this.repo.create({
        userId,
        tokenHash,
        expiresAt: String(Date.now() + 3600000),
        });
    await this.repo.save(record);
  }

  async verifyToken(rawToken: string) {
    const records = await this.repo.find();

    for (const record of records) {
      const isValid = await bcrypt.compare(rawToken, record.tokenHash);
      if (isValid && Number(record.expiresAt) > Date.now()) {
        return record;
      }
    }

    throw new BadRequestException('Invalid or expired token');
  }

  async delete(id: number) {
    await this.repo.delete(id);
  }
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupExpired() {
    await this.repo
      .createQueryBuilder()
      .delete()
      .where('expiresAt < :now', { now: Date.now() })
      .execute();
  }
}
