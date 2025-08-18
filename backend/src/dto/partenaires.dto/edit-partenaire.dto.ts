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
import { ContactDto } from './contact.dto';

export class EditPartenaireDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @MinLength(2)
  @IsOptional()
  @Matches(/^[a-zA-ZÀ-ÿ0-9 &'\-\.(),]+$/, {
    message: 'Company name can only contain letters, numbers, spaces, and common business punctuation'
  })
  @Transform(({ value }) => value?.trim())
  nomCompagnie?: string;

  @IsString()
  @Matches(/^[0-9]{9}$/, {
    message: 'SIREN must be exactly 9 digits'
  })
  @IsOptional()
  @Transform(({ value }) => value?.replace(/\s/g, '')) // Remove any spaces
  siren?: string;

  @IsString()
  @MinLength(8)
  @IsOptional()
  @Matches(/^[A-Z]{2}[0-9A-Z]{8,13}$/, {
    message: 'VAT number must start with 2 letters followed by 8-13 alphanumeric characters'
  })
  @Transform(({ value }) => value?.toUpperCase().replace(/\s/g, ''))
  numeroTva?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContactDto)
  @ArrayMinSize(1, { message: 'At least one contact is required' })
  @IsOptional()
  contacts?: ContactDto[];

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1, { message: 'At least one activity is required' })
  @IsOptional()
  @Transform(({ value }) => value?.map((activity: string) => activity.trim()).filter((activity: string) => activity.length > 0))
  activites?: string[];

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  adresse?: string;
}