import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@noa/database';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown database connection error';
      throw new Error(
        `${message}\n\nStart Postgres with: docker compose up -d postgres\nThen run migrations: pnpm db:migrate`,
      );
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
