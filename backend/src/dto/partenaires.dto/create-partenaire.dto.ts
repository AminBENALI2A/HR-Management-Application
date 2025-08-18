import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested, Matches } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ContactDto } from './contact.dto';

export class CreatePartenaireDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-ZÀ-ÿ0-9 &'\-\.(),]+$/, {
    message: 'Company name can only contain letters, numbers, spaces, and common business punctuation'
  })
  @Transform(({ value }) => value?.trim())
  nomCompagnie: string;

  @IsString()
  @IsNotEmpty()
  
  @Matches(/^[0-9]{9}$/, {
    message: 'SIREN must be exactly 9 digits'
  })
  @Transform(({ value }) => value?.replace(/\s/g, '')) // Remove any spaces
  siren: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z]{2}[0-9A-Z]{8,13}$/, {
    message: 'VAT number must start with 2 letters followed by 8-13 alphanumeric characters'
  })
  @Transform(({ value }) => value?.toUpperCase().replace(/\s/g, ''))
  numeroTva: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContactDto)
  contacts: ContactDto[];

  @IsArray()
  @IsNotEmpty()
  activites: string[];

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  adresse?: string;
}