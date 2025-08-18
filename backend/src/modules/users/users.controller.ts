import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../guards/roles.decorator';
import { CreateUserDto } from '../../dto/users.dto/create-user.dto';
import { EditUserDto } from '../../dto/users.dto/edit-user.dto';

@Controller('/api/users')
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {} // <-- lowercase

  @Get()
  @Roles('Super Admin') // Only super admins can access
  async usersList() {
    const users = await this.usersService.getUsers();
    return {
      message: 'Users retrieved successfully',
      users,
    };
  }
  @Post('addUser')
  @Roles('Super Admin') // Only super admins can access
  async addUser(@Body() userData: CreateUserDto) {
    console.log("Adding user:", userData);
    const newUser = await this.usersService.createUser(userData);
    return {
      message: 'User created successfully',
      user: newUser,
    };
  }

  @Patch('editUser')
  @Roles('Super Admin') // Only super admins can access
  async editUser(@Body() userData: EditUserDto) {
    console.log("Editing user:", userData);
    const updatedUser = await this.usersService.editUser(userData);
    return {
      message: 'User updated successfully',
      user: updatedUser,
    };
  }

  @Patch('status')
  @Roles('Super Admin') // Only super admins can access
  async changeUserStatus(@Body() userData: { email: string; active: boolean }) {
    console.log("Changing user status:", userData);
    const updatedUser = await this.usersService.changeUserStatus(userData);
    return {
      message: 'User status updated successfully',
      user: updatedUser,
    };
  }
}
