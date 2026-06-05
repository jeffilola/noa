import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DeviceService {
  constructor(private readonly prisma: PrismaService) {}

  list(userId: string) {
    return this.prisma.device.findMany({ where: { userId, isActive: true } });
  }

  register(userId: string, name: string, platform: string, deviceFingerprint?: string) {
    return this.prisma.device.create({
      data: { userId, name, platform, deviceFingerprint, lastSeenAt: new Date() },
    });
  }

  async deactivate(userId: string, deviceId: string) {
    const device = await this.prisma.device.findFirst({ where: { id: deviceId, userId } });
    if (!device) throw new NotFoundException('Device not found');
    return this.prisma.device.update({ where: { id: deviceId }, data: { isActive: false } });
  }
}
