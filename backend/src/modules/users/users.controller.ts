import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../guards/roles.decorator';

@Controller('users')
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
}
