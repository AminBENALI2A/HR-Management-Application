import {
  IsEmail,
  IsString,
  MinLength,
  Matches,
  IsArray,
  IsBoolean,
  IsOptional,
  ValidateNested,
  ArrayMinSize,
  ArrayNotEmpty
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class ContactDto {
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  @Matches(/^[a-zA-ZÀ-ÿ '-]+$/, {
    message: 'Last name can only contain letters, spaces, hyphens, and apostrophes'
  })
  nom?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  @Matches(/^[a-zA-ZÀ-ÿ '-]+$/, {
    message: 'First name can only contain letters, spaces, hyphens, and apostrophes'
  })
  prenom?: string;

  @IsEmail()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  email?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  @Matches(/^\+[0-9]{7,15}$/, {
    message: 'Phone must be in E.164 format (+[country code][number])'
  })
  telephone: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  role?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  direction?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  departement?: string;
}
