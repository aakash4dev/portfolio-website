import { MetadataRoute } from 'next'
import { blogPosts } from '@/lib/blogs'
import { siteUrl } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = siteUrl

    // Static routes
    const routes = [
        '',
        '/blogs',
        '/projects',
        '/contact',
        '/tutorials',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // Dynamic blog routes
    const blogRoutes = blogPosts.map((post) => ({
        url: `${baseUrl}/blogs/${post.id}`,
        lastModified: new Date(post.date),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }))

    return [...routes, ...blogRoutes]
}
