// app/blog/[blogslug]/page.jsx
import { cache } from "react";
import BlogViewPage from "./BlogViewPage";

// Cached fetch function with ISR (revalidate every 5 minutes)
const fetchBlog = cache(async (slug) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/blogs/slug/${slug}`,
      { next: { revalidate: 300 } } // ISR: cache 5 minutes
    );

    if (!res.ok) return null;

    const data = await res.json();
    return data?.data;
  } catch (error) {
    console.error("Fetch Blog Error:", error);
    return null;
  }
});

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { blogslug } = await params;
  const blog = await fetchBlog(blogslug);
  const meta = blog?.metadata;

  if (!blog) {
    return {
      title: "Blog Not Found",
      description: "This blog post could not be found.",
    };
  }

  const title = meta?.title || blog.title;
  const description = meta?.description || blog.excerpt || '';
  const ogTitle = meta?.ogTitle || title;
  const ogDescription = meta?.ogDescription || description;
  const ogImage = meta?.ogImage || blog.thumbnail || '';
  const twitterTitle = meta?.twitterTitle || ogTitle;
  const twitterDescription = meta?.twitterDescription || ogDescription;
  const twitterImage = meta?.twitterImage || ogImage;
  const canonical = meta?.canonicalUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/blogs/slug/${blog.slug}`;

  return {
    title,
    description,
    keywords: meta?.keywords || '',
    alternates: { canonical },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'Sobha Properties',
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: ogTitle }] : [],
      locale: 'en_IN',
      type: 'article',
      publishedTime: blog.createdAt,
      modifiedTime: blog.updatedAt,
    },
    twitter: {
      card: meta?.twitterCard || 'summary_large_image',
      title: twitterTitle,
      description: twitterDescription,
      images: twitterImage ? [twitterImage] : [],
    },
    robots: {
      index: blog.isActive !== false,
      follow: true,
    },
  };
}

// JSON-LD Structured Data
function generateJsonLd(blog) {
  const meta = blog?.metadata;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: meta?.description || blog.excerpt || '',
    image: blog.thumbnail || '',
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/blogs/${blog.slug}`,
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt,
    author: {
      '@type': 'Organization',
      name: process.env.NEXT_PUBLIC_SITE_NAME || 'Sobha Properties',
      url: process.env.NEXT_PUBLIC_SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: process.env.NEXT_PUBLIC_SITE_NAME || 'Sobha Properties',
      url: process.env.NEXT_PUBLIC_SITE_URL,
    },
  };
}

// Generate static params for pre-rendering all blogs
export async function generateStaticParams() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs`, { next: { revalidate: 300 } });
    const blogs = await res.json();

    return blogs.data.map(blog => ({
      blogslug: blog.slug,
    }));
  } catch (error) {
    console.error("Error fetching blogs for static params:", error);
    return [];
  }
}

// Page component
async function page({ params }) {
  const { blogslug } = await params;
  const blog = await fetchBlog(blogslug);

  if (!blog) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-red-600 text-4xl">404</h1>
      </div>
    );
  }

  return (
    <>
      {/* JSON-LD Structured Data */}
      {blog && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateJsonLd(blog)) }}
        />
      )}
      <BlogViewPage blogData={blog} />
    </>
  );
}

export default page;