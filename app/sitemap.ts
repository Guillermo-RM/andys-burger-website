import type { MetadataRoute } from "next";
import { burgerImages, siteImages } from "@/lib/images";
import { absoluteUrl, siteLastModified } from "@/lib/site";

const burgerImageUrls = Object.values(burgerImages).map(
  (image) => image.seoSrc,
);

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl("/"),
      lastModified: siteLastModified,
      changeFrequency: "weekly",
      priority: 1,
      images: [siteImages.homeHero.seoSrc, ...burgerImageUrls],
    },
    {
      url: absoluteUrl("/menu"),
      lastModified: siteLastModified,
      changeFrequency: "weekly",
      priority: 0.9,
      images: burgerImageUrls,
    },
    {
      url: absoluteUrl("/contacto"),
      lastModified: siteLastModified,
      changeFrequency: "monthly",
      priority: 0.8,
      images: [siteImages.homeHero.seoSrc],
    },
  ];
}
