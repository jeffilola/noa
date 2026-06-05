export class PacsLedIssuanceNotAllowedError extends Error {
  readonly issueInPacs = true;

  constructor(message = 'Corporate access credentials must be issued in PACS (e.g. Lenel Elements).') {
    super(message);
    this.name = 'PacsLedIssuanceNotAllowedError';
  }
}
