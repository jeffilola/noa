import { Injectable } from '@nestjs/common';
import { EncryptionService } from '@noa/encryption';
import { PrismaService } from '../prisma/prisma.service';

export interface UpsertUserDto {
  clerkUserId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
}

@Injectable()
export class UserRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly encryption: EncryptionService,
  ) {}

  async upsertFromClerk(dto: UpsertUserDto) {
    const existing = await this.prisma.user.findUnique({ where: { clerkUserId: dto.clerkUserId } });
    if (existing) {
      return this.updateEncrypted(existing.id, dto);
    }
    return this.create(dto);
  }

  async create(dto: UpsertUserDto) {
    const data: Record<string, unknown> = {
      clerkUserId: dto.clerkUserId,
      encryptionKeyVersion: 1,
    };
    await this.applyPiiFields(data, dto);
    return this.prisma.user.create({ data: data as never });
  }

  private async updateEncrypted(userId: string, dto: UpsertUserDto) {
    const data: Record<string, unknown> = {};
    await this.applyPiiFields(data, dto);
    if (Object.keys(data).length === 0) {
      return this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    }
    return this.prisma.user.update({ where: { id: userId }, data: data as never });
  }

  private async applyPiiFields(data: Record<string, unknown>, dto: UpsertUserDto) {
    if (dto.firstName) {
      const enc = await this.encryption.encrypt(dto.firstName, 'first_name');
      data.firstNameEnc = enc.ciphertext;
      data.firstNameIv = enc.iv;
    }
    if (dto.lastName) {
      const enc = await this.encryption.encrypt(dto.lastName, 'last_name');
      data.lastNameEnc = enc.ciphertext;
      data.lastNameIv = enc.iv;
    }
    if (dto.email) {
      const normalized = this.encryption.normalizeEmail(dto.email);
      const enc = await this.encryption.encrypt(normalized, 'email');
      data.emailEnc = enc.ciphertext;
      data.emailIv = enc.iv;
      data.emailHash = await this.encryption.hashEmail(normalized);
    }
    if (dto.phoneNumber) {
      const enc = await this.encryption.encrypt(dto.phoneNumber, 'phone_number');
      data.phoneNumberEnc = enc.ciphertext;
      data.phoneNumberIv = enc.iv;
    }
    if (dto.dateOfBirth) {
      const enc = await this.encryption.encrypt(dto.dateOfBirth, 'date_of_birth');
      data.dateOfBirthEnc = enc.ciphertext;
      data.dateOfBirthIv = enc.iv;
    }
  }

  async findByIdDecrypted(userId: string, actorUserId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) return null;

    const ctx = {
      actorUserId,
      resourceType: 'user' as const,
      resourceId: userId,
      purpose: 'user_profile_view' as const,
    };

    const result: Record<string, string | undefined> = {
      id: user.id,
      clerkUserId: user.clerkUserId,
    };

    if (user.firstNameEnc && user.firstNameIv) {
      result.firstName = await this.encryption.decrypt(
        { ciphertext: user.firstNameEnc, iv: user.firstNameIv, keyVersion: user.encryptionKeyVersion },
        'first_name',
        ctx,
      );
    }
    if (user.lastNameEnc && user.lastNameIv) {
      result.lastName = await this.encryption.decrypt(
        { ciphertext: user.lastNameEnc, iv: user.lastNameIv, keyVersion: user.encryptionKeyVersion },
        'last_name',
        ctx,
      );
    }
    if (user.emailEnc && user.emailIv) {
      result.email = await this.encryption.decrypt(
        { ciphertext: user.emailEnc, iv: user.emailIv, keyVersion: user.encryptionKeyVersion },
        'email',
        ctx,
      );
    }
    if (user.phoneNumberEnc && user.phoneNumberIv) {
      result.phoneNumber = await this.encryption.decrypt(
        { ciphertext: user.phoneNumberEnc, iv: user.phoneNumberIv, keyVersion: user.encryptionKeyVersion },
        'phone_number',
        ctx,
      );
    }
    if (user.dateOfBirthEnc && user.dateOfBirthIv) {
      result.dateOfBirth = await this.encryption.decrypt(
        { ciphertext: user.dateOfBirthEnc, iv: user.dateOfBirthIv, keyVersion: user.encryptionKeyVersion },
        'date_of_birth',
        ctx,
      );
    }

    return result;
  }

  listMemberships(userId: string) {
    return this.prisma.membership.findMany({
      where: { userId, removedAt: null },
      include: { organization: { select: { id: true, name: true, slug: true } } },
      orderBy: { joinedAt: 'desc' },
    });
  }
}
