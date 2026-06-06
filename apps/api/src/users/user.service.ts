import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  normalizeProfileUpdate,
  validateProfileUpdate,
} from '@noa/shared';
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

  async updateMe(
    userId: string,
    body: { phoneNumber?: string; dateOfBirth?: string },
  ) {
    const hasPhone = body.phoneNumber !== undefined;
    const hasDob = body.dateOfBirth !== undefined;

    if (!hasPhone && !hasDob) {
      throw new BadRequestException('Provide phoneNumber and/or dateOfBirth to update.');
    }

    const errors = validateProfileUpdate(body);
    if (Object.keys(errors).length > 0) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors,
      });
    }

    const normalized = normalizeProfileUpdate(body);
    await this.users.updateProfile(userId, normalized);
    return this.getMe(userId);
  }

  upsertFromClerk(dto: Parameters<UserRepository['upsertFromClerk']>[0]) {
    return this.users.upsertFromClerk(dto);
  }
}
