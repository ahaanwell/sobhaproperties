import ProjectViewPage from "./ProjectViewPage";

export async function generateMetadata({ params }) {
  const {pSlug} = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/projects/slug/${pSlug}`,
    { cache: "no-store" }
  );

  const data = await res.json();
  const project = data?.data;
  const meta = project?.metadata;

  if (!project) {
    return {
      title: "Project Not Found",
      description: "This project could not be found.",
    };
  }

  // Fallback chain: metadata field → project field → project name
  const title = meta?.title || project.name
  const description = meta?.description || project.moreAbout || ''
  const ogTitle = meta?.ogTitle || title
  const ogDescription = meta?.ogDescription || description
  const ogImage = meta?.ogImage || project.mainImage || ''
  const twitterTitle = meta?.twitterTitle || ogTitle
  const twitterDescription = meta?.twitterDescription || ogDescription
  const twitterImage = meta?.twitterImage || ogImage
  const canonical = meta?.canonicalUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/projects/${project.slug}`

  return {
    title,
    description,
    keywords: meta?.keywords || '',

    // Canonical URL
    alternates: {
      canonical,
    },

    // Open Graph
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      siteName: 'Sobha Properties',
      images: ogImage ? [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: ogTitle,
        }
      ] : [],
      locale: 'en_IN',
      type: 'website',
    },

    // Twitter Card
    twitter: {
      card: meta?.twitterCard || 'summary_large_image',
      title: twitterTitle,
      description: twitterDescription,
      images: twitterImage ? [twitterImage] : [],
    },

    // Robots
    robots: {
      index: project.isActive !== false,
      follow: true,
      googleBot: {
        index: project.isActive !== false,
        follow: true,
      },
    },
  };
}

// JSON-LD Structured Data
function generateJsonLd(project) {
  const meta = project?.metadata

  return {
    '@context': 'https://schema.org',
    '@type': meta?.schemaType || 'Apartment',
    name: project.name,
    description: meta?.description || project.moreAbout || '',
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/projects/${project.slug}`,
    image: project.mainImage || '',
    address: {
      '@type': 'PostalAddress',
      streetAddress: project.location || '',
      addressLocality: meta?.city || '',
      addressRegion: meta?.state || '',
      postalCode: meta?.pincode || '',
      addressCountry: 'IN',
    },
    offers: project.basePrice ? {
      '@type': 'Offer',
      price: project.basePrice,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    } : undefined,
    numberOfRooms: project.unitVariant || '',
    floorSize: project.totalLandArea ? {
      '@type': 'QuantitativeValue',
      value: project.totalLandArea,
      unitCode: 'ACR',
    } : undefined,
    ...(project.reraId && {
      identifier: {
        '@type': 'PropertyValue',
        name: 'RERA ID',
        value: project.reraId,
      }
    }),
    // FAQ Schema
    ...(project.faqList?.length > 0 && {
      mainEntity: project.faqList.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        }
      }))
    }),
  }
}

async function fetchProject(slug){
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/slug/${slug}`, {
    cache: "no-store",
  });

  const data = await res.json();
  return data?.data;
}

async function page({ params }) {
  const {pSlug} = await params;

  let project = null;
  let error = null;
  let loading = false;

  try {
    loading = true;
    project = await fetchProject(pSlug);
    loading = false
  } catch (err) {
    error = err.message || "Something went wrong";
  } finally {
    loading = false;
  }
  return (
    <>
      {project && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateJsonLd(project)),
          }}
        />
      )}

      <ProjectViewPage
        projectData={project}
        loading={loading}
        error={error}
      />
    </>
  );
}

export default page;