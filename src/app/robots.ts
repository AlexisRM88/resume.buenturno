import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/preview", "/terms", "/employers", "/u/"],
        disallow: ["/dashboard", "/admin", "/signin"],
      },
    ],
    sitemap: "https://resume.buenturno.com/sitemap.xml",
  };
}
