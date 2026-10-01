import { cache } from "react";
import { prisma } from "./prisma";
import { cached } from "./cache";

export type SiteSettings = Record<string, string>;

const getSiteSettingsCached = cached(async (): Promise<SiteSettings> => {
  const rows = await prisma.siteSetting.findMany();
  const settings: SiteSettings = {};
  for (const row of rows) {
    settings[row.key] = row.value;
  }
  return settings;
}, "getSiteSettings");

export const getSiteSettings = cache(getSiteSettingsCached);
