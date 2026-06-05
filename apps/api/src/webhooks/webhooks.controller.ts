import { Body, Controller, Headers, Post } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { AuditService } from '../audit/audit.service';

interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses?: Array<{ email_address: string }>;
    first_name?: string | null;
    last_name?: string | null;
  };
}

@Controller('webhooks')
export class WebhooksController {
  constructor(
    private readonly users: UserService,
    private readonly audit: AuditService,
  ) {}

  @Post('clerk')
  async clerkWebhook(
    @Body() event: ClerkWebhookEvent,
    @Headers('svix-id') _svixId?: string,
  ) {
    if (event.type === 'user.created' || event.type === 'user.updated') {
      const email = event.data.email_addresses?.[0]?.email_address;
      await this.users.upsertFromClerk({
        clerkUserId: event.data.id,
        firstName: event.data.first_name ?? undefined,
        lastName: event.data.last_name ?? undefined,
        email,
      });
      await this.audit.log({
        action: event.type === 'user.created' ? 'user_created' : 'user_updated',
        resourceType: 'user',
        resourceId: event.data.id,
        metadata: { clerkUserId: event.data.id },
      });
    }
    return { received: true };
  }
}
