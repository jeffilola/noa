import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { ClerkAuthGuard } from '../common/guards/clerk-auth.guard';
import { DeviceService } from './device.service';

@Controller('devices')
@UseGuards(ClerkAuthGuard)
export class DeviceController {
  constructor(private readonly devices: DeviceService) {}

  @Get()
  list(@Req() req: Request) {
    return this.devices.list(req.auth!.userId);
  }

  @Post()
  register(
    @Req() req: Request,
    @Body() body: { name: string; platform: string; deviceFingerprint?: string },
  ) {
    return this.devices.register(
      req.auth!.userId,
      body.name,
      body.platform,
      body.deviceFingerprint,
    );
  }

  @Delete(':id')
  deactivate(@Req() req: Request, @Param('id') id: string) {
    return this.devices.deactivate(req.auth!.userId, id);
  }
}
