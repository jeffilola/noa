import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly users: UserRepository) {}

  async getMe(userId: string) {
    const user = await this.users.findByIdDecrypted(userId, userId);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  listMemberships(userId: string) {
    return this.users.listMemberships(userId);
  }

  upsertFromClerk(dto: Parameters<UserRepository['upsertFromClerk']>[0]) {
    return this.users.upsertFromClerk(dto);
  }
}
