import { cache } from "react";
import { prisma } from "./prisma";

export type SiteSettings = Record<string, string>;

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const rows = await prisma.siteSetting.findMany();
  const settings: SiteSettings = {};
  for (const row of rows) {
    settings[row.key] = row.value;
  }
  return settings;
});
