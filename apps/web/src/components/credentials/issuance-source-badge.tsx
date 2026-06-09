export function IssuanceSourceBadge({ source }: { source: 'PACS' | 'NOA' | string }) {
  const normalized = source.toUpperCase() === 'PACS' ? 'PACS' : 'NOA';

  return (
    <span className={`badge ${normalized === 'PACS' ? 'badge-pacs' : 'badge-noa'}`}>
      {normalized}
    </span>
  );
}
