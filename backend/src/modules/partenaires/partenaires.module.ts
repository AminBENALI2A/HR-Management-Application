import { Module } from '@nestjs/common';
import { PartenairesService } from './partenaires.service';
import { PartenairesController } from './partenaires.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partenaires } from '../../entities/Partenaires';
import { AuthModule } from '../auth/auth.module'; 

@Module({
  imports: [TypeOrmModule.forFeature([Partenaires]), AuthModule],
  providers: [PartenairesService],
  controllers: [PartenairesController],
  exports: [PartenairesService],
})
export class PartenairesModule {}
