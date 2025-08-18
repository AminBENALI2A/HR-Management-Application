import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Partenaires } from '../../entities/Partenaires';
import { CreatePartenaireDto } from '../../dto/partenaires.dto/create-partenaire.dto';
import { EditPartenaireDto } from '../../dto/partenaires.dto/edit-partenaire.dto';

@Injectable()
export class PartenairesService {
  constructor(
    @InjectRepository(Partenaires) private partenairesRepository: Repository<Partenaires>
  ) {}

  async getPartenaires() {
    const partenaires = await this.partenairesRepository.find();
    return partenaires.map(partenaire => ({
      id: partenaire.id,
      nomCompagnie: partenaire.nomCompagnie,
      siren: partenaire.siren,
      numeroTva: partenaire.numeroTva,
      contacts: partenaire.contacts,
      activites: partenaire.activites,
      adresse: partenaire.adresse,
      dateCreation: partenaire.dateCreation,
      dateModification: partenaire.dateModification,
      active: partenaire.active,
    }));
  }

  async createPartenaire(partenaireData: CreatePartenaireDto) {
    const newPartenaire = this.partenairesRepository.create({
      ...partenaireData,
      dateCreation: new Date(),
      dateModification: new Date(),
      active: true,
    });
    return await this.partenairesRepository.save(newPartenaire);
  }

  async editPartenaire(partenaireData: EditPartenaireDto) {
    // Find the partenaire by id (car email n'existe plus dans l'entité)
    const existingPartenaire = await this.partenairesRepository.findOne({ where: { siren: partenaireData.siren } });
    if (!existingPartenaire) throw new Error('Partenaire not found');

    // Update only allowed fields
    if (partenaireData.nomCompagnie !== undefined) existingPartenaire.nomCompagnie = partenaireData.nomCompagnie;
    if (partenaireData.siren !== undefined) existingPartenaire.siren = partenaireData.siren;
    if (partenaireData.numeroTva !== undefined) existingPartenaire.numeroTva = partenaireData.numeroTva;
    if (partenaireData.contacts !== undefined) existingPartenaire.contacts = partenaireData.contacts;
    if (partenaireData.activites !== undefined) existingPartenaire.activites = partenaireData.activites;
    if (partenaireData.adresse !== undefined) existingPartenaire.adresse = partenaireData.adresse;

    existingPartenaire.dateModification = new Date();

    return await this.partenairesRepository.save(existingPartenaire);
  }

  async changePartenaireStatus(partenaireData: { siren: string; active: boolean }) {
    const existingPartenaire = await this.partenairesRepository.findOne({ where: { siren: partenaireData.siren } });
    if (!existingPartenaire) throw new Error('Partenaire not found');

    existingPartenaire.active = partenaireData.active;
    existingPartenaire.dateModification = new Date();

    return await this.partenairesRepository.save(existingPartenaire);
  }
}
