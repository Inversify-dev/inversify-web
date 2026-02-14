import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://inversify.lk';
  const currentDate = new Date();

  return [
    {
      url: baseUrl,                        // Home page
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/How-We-Work`,       // About / Process page (AboutHero + RoadmapJourney)
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/invert`,            // Invert / 3D showcase page
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/portfolio`,         // 3D Dome Gallery — selected works
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/digitalization`,    // Contact / Get started page
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ];
}