import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { PartenairesService } from './partenaires.service';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../guards/roles.decorator';
import { CreatePartenaireDto } from '../../dto/partenaires.dto/create-partenaire.dto';
import { EditPartenaireDto } from '../../dto/partenaires.dto/edit-partenaire.dto';

@Controller('/api/partenaires')
@UseGuards(AuthGuard, RolesGuard)
export class PartenairesController {
  constructor(private partenairesService: PartenairesService) {}

  @Get()
  @Roles('Super Admin') // Only super admins can access
  async partenairesList() {
    console.log("Fetching partenaires list...");
    const partenaires = await this.partenairesService.getPartenaires();
    console.log("Fetched partenaires list:", partenaires);
    return {
      message: 'Partenaires retrieved successfully',
      partenaires,
    };
  }

  @Post('addPartenaire')
  @Roles('Super Admin')
  async addPartenaire(@Body() partenaireData: CreatePartenaireDto) {
    console.log("Adding partenaire:", partenaireData);
    const newPartenaire = await this.partenairesService.createPartenaire(partenaireData);
    return {
      message: 'Partenaire created successfully',
      partenaire: newPartenaire,
    };
  }

  @Patch('editPartenaire')
  @Roles('Super Admin')
  async editPartenaire(@Body() partenaireData: EditPartenaireDto) {
    console.log("Editing partenaire:", partenaireData);
    const updatedPartenaire = await this.partenairesService.editPartenaire(partenaireData);
    return {
      message: 'Partenaire updated successfully',
      partenaire: updatedPartenaire,
    };
  }

  @Patch('status')
  @Roles('Super Admin')
  async changePartenaireStatus(@Body() partenaireData: { siren: string; active: boolean }) {
    console.log("Changing partenaire status:", partenaireData);
    const updatedPartenaire = await this.partenairesService.changePartenaireStatus(partenaireData);
    return {
      message: 'Partenaire status updated successfully',
      partenaire: updatedPartenaire,
    };
  }
}
