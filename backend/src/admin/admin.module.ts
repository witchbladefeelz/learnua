import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UsersModule } from '../users/users.module';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
  imports: [UsersModule],
  controllers: [AdminController],
  providers: [RolesGuard],
})
export class AdminModule {}
