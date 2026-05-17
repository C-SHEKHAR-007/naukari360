import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = "https://naukari360.in";

  // Try to get admin-configured robots.txt content
  const setting = await prisma.siteSetting.findUnique({
    where: { key: "robots_txt" },
  });

  // If admin has set custom rules, parse them
  if (setting?.value) {
    const lines = setting.value.split("\n").filter((l) => l.trim());
    const rules: MetadataRoute.Robots["rules"] = [];
    let currentAgent = "*";
    const allow: string[] = [];
    const disallow: string[] = [];

    for (const line of lines) {
      if (line.toLowerCase().startsWith("user-agent:")) {
        if (allow.length || disallow.length) {
          rules.push({ userAgent: currentAgent, allow: [...allow], disallow: [...disallow] });
          allow.length = 0;
          disallow.length = 0;
        }
        currentAgent = line.split(":")[1].trim();
      } else if (line.toLowerCase().startsWith("allow:")) {
        allow.push(line.split(":").slice(1).join(":").trim());
      } else if (line.toLowerCase().startsWith("disallow:")) {
        disallow.push(line.split(":").slice(1).join(":").trim());
      }
    }
    if (allow.length || disallow.length) {
      rules.push({ userAgent: currentAgent, allow: [...allow], disallow: [...disallow] });
    }

    return {
      rules: rules.length ? rules : [{ userAgent: "*", allow: "/" }],
      sitemap: `${baseUrl}/sitemap.xml`,
    };
  }

  // Default robots.txt
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/go/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
