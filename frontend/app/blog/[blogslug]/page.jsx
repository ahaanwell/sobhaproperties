import BlogViewPage from "./BlogViewPage";

export async function generateMetadata({ params }) {
  const { blogslug } = params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/blogs/slug/${blogslug}`,
    { cache: "no-store" }
  );

  const data = await res.json();
  const blog = data?.data;
  const meta = blog?.metadata;

  if (!blog) {
    return {
      title: "Blog Not Found",
      description: "This blog post could not be found.",
    };
  }

  const title = meta?.title || blog.title
  const description = meta?.description || blog.excerpt || ''
  const ogTitle = meta?.ogTitle || title
  const ogDescription = meta?.ogDescription || description
  const ogImage = meta?.ogImage || blog.thumbnail || ''
  const twitterTitle = meta?.twitterTitle || ogTitle
  const twitterDescription = meta?.twitterDescription || ogDescription
  const twitterImage = meta?.twitterImage || ogImage
  const canonical = meta?.canonicalUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/blogs/${blog.slug}`

  return {
    title,
    description,
    keywords: meta?.keywords || '',

    alternates: {
      canonical,
    },

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
  const meta = blog?.metadata
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
  }
}

async function page({ params }) {
  const { blogslug } = params;
  let error = null;
  let loading = true;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/blogs/slug/${blogslug}`,
    { cache: "no-store" }
  );
  const data = await res.json();
  loading = false
  const blog = data?.data;

  return (
    <>
      {blog && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateJsonLd(blog))
          }}
        />
      )}
      <BlogViewPage blogData={blog} />
    </>
  );
}

export default page;