const DATE_FIELDS = ["lastDate", "examDate", "resultDate"] as const;

/**
 * Shared by the admin posts routes and the machine ingestion route: turns
 * empty-string form/JSON values into null (Prisma rejects "" for optional
 * scalar fields it doesn't expect) and parses the three date fields.
 */
export function cleanPostData(data: Record<string, unknown>): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    cleaned[key] = value === "" ? null : value;
  }
  for (const field of DATE_FIELDS) {
    if (cleaned[field]) cleaned[field] = new Date(cleaned[field] as string);
  }
  return cleaned;
}
