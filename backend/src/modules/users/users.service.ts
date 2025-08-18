import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../../entities/Users';
import { CreateUserDto } from '../../dto/users.dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { EditUserDto } from '../../dto/users.dto/edit-user.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>
  ) {}

  async getUsers() {
    const users = await this.usersRepository.find();
    return users.map(user => ({
      id: user.id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      telephone: user.telephone,
      role: user.role,
      active: user.active,
      dateCreation: user.dateCreation.toISOString(),
      dateModification: user.dateModification.toISOString(),
    }));
  }



  async createUser(userData: CreateUserDto) {
    const newUser = this.usersRepository.create({
    ...userData,
    passwordHash: await bcrypt.hash(Math.random().toString(36).slice(-8), 10)
  });
    return await this.usersRepository.save(newUser);
  }



  async editUser(userData: EditUserDto) {
    // Find the user by email
    const existingUser = await this.usersRepository.findOne({ where: { email: userData.email } });
    if (!existingUser) throw new Error('User not found');

    // Update only allowed fields with correct typing
    if (userData.prenom !== undefined) existingUser.prenom = userData.prenom;
    if (userData.nom !== undefined) existingUser.nom = userData.nom;
    if (userData.role !== undefined) existingUser.role = userData.role;
    if (userData.telephone !== undefined) existingUser.telephone = userData.telephone;

    return await this.usersRepository.save(existingUser);
  }

  async changeUserStatus(userData: { email: string; active: boolean }) {
    // Find the user by email
    const existingUser = await this.usersRepository.findOne({ where: { email: userData.email } });
    if (!existingUser) throw new Error('User not found');

    // Update the user's active status
    existingUser.active = userData.active;

    return await this.usersRepository.save(existingUser);
  }
}
