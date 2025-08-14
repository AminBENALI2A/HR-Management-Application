import {
  IsEmail,
  IsString,
  MinLength,
  Matches,
  IsIn,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class EditUserDto {
  @IsString()
  @MinLength(2)
  @Matches(/^[a-zA-ZÀ-ÿ '-]+$/, {
    message: 'First name can only contain letters, spaces, hyphens, and apostrophes'
  })
  prenom: string;

  @IsString()
  @MinLength(2)
  @Matches(/^[a-zA-ZÀ-ÿ '-]+$/, {
    message: 'Last name can only contain letters, spaces, hyphens, and apostrophes'
  })
  nom: string;

  @IsEmail()
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @Matches(/^\+[0-9]{7,15}$/, {
    message: 'Phone must be in E.164 format (+[country code][number])'
  })
  telephone: string;

  @IsIn(['Ressource', 'Gestionnaire', 'Super Admin'], {
    message: 'Role must be one of: Ressource, Gestionnaire, Super Admin'
  })
  role: string;
}
