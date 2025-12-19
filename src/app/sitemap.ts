import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://risegen.pl' // Update this if domain changes

    // 1. Static Routes with optimized SEO priorities
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/projekty`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/aktualnosci`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/o-nas`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/kontakt`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/zgloszenia`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/deklaracja-dostepnosci`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/polityka-prywatnosci`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/polityka-cookies`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ];

    // 2. Dynamic Projects
    let projects: MetadataRoute.Sitemap = [];
    try {
        const fetchedProjects = await prisma.project.findMany({
            where: { status: "CURRENT" },
            select: { slug: true, updatedAt: true }
        });

        projects = fetchedProjects.map((project) => ({
            url: `${baseUrl}/projekty/${project.slug}`,
            lastModified: project.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        }));
    } catch (error) {
        console.error("Failed to fetch projects for sitemap", error);
    }

    // 3. Dynamic News
    let news: MetadataRoute.Sitemap = [];
    try {
        const fetchedNews = await prisma.news.findMany({
            select: { slug: true, updatedAt: true }
        });

        news = fetchedNews.map((item) => ({
            url: `${baseUrl}/aktualnosci/${item.slug}`,
            lastModified: item.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        }));
    } catch (error) {
        console.error("Failed to fetch news for sitemap", error);
    }

    return [...staticRoutes, ...projects, ...news];
}
