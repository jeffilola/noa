import { Body, Controller, Post } from '@nestjs/common';
import type { HidOrigoCloudEvent } from '@noa/integrations';
import { PacsIngestService } from './pacs-ingest.service';

@Controller('webhooks')
export class PacsIngestController {
  constructor(private readonly pacsIngestService: PacsIngestService) {}

  @Post('hid-origo')
  ingestHidOrigo(@Body() body: HidOrigoCloudEvent | HidOrigoCloudEvent[]) {
    const events = Array.isArray(body) ? body : [body];
    return this.pacsIngestService.ingestHidOrigoEvents(events);
  }
}
