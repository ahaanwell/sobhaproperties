import ProjectViewPage from "./ProjectViewPage";

// ==========================
// Fetch Project
// ==========================
async function fetchProject(slug) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/projects/slug/${slug}`,
    {
      next: { revalidate: 300 }, // cache for 5 minutes
    }
  );

  if (!res.ok) return null;

  const data = await res.json();
  return data?.data;
}

// ==========================
// SEO Metadata
// ==========================
export async function generateMetadata({ params }) {
  const {pSlug} = await params;

  const project = await fetchProject(pSlug);

  if (!project) {
    return {
      title: "Project Not Found",
      description: "This project could not be found.",
    };
  }

  const meta = project?.metadata;

  const title = meta?.title || project.name;
  const description = meta?.description || project.moreAbout || "";
  const ogTitle = meta?.ogTitle || title;
  const ogDescription = meta?.ogDescription || description;
  const ogImage = meta?.ogImage || project.mainImage || "";
  const twitterTitle = meta?.twitterTitle || ogTitle;
  const twitterDescription = meta?.twitterDescription || ogDescription;
  const twitterImage = meta?.twitterImage || ogImage;

  const canonical =
    meta?.canonicalUrl ||
    `${process.env.NEXT_PUBLIC_SITE_URL}/projects/${project.slug}`;

  return {
    title,
    description,
    keywords: meta?.keywords || "",

    alternates: {
      canonical,
    },

    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      siteName: "Sobha Properties",
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: ogTitle,
            },
          ]
        : [],
      locale: "en_IN",
      type: "website",
    },

    twitter: {
      card: meta?.twitterCard || "summary_large_image",
      title: twitterTitle,
      description: twitterDescription,
      images: twitterImage ? [twitterImage] : [],
    },

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

// ==========================
// JSON-LD Schema
// ==========================
function generateJsonLd(project) {
  const meta = project?.metadata;

  return {
    "@context": "https://schema.org",
    "@type": meta?.schemaType || "Apartment",
    name: project.name,
    description: meta?.description || project.moreAbout || "",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/projects/${project.slug}`,
    image: project.mainImage || "",

    address: {
      "@type": "PostalAddress",
      streetAddress: project.location || "",
      addressLocality: meta?.city || "",
      addressRegion: meta?.state || "",
      postalCode: meta?.pincode || "",
      addressCountry: "IN",
    },

    ...(project.basePrice && {
      offers: {
        "@type": "Offer",
        price: project.basePrice,
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
      },
    }),

    ...(project.totalLandArea && {
      floorSize: {
        "@type": "QuantitativeValue",
        value: project.totalLandArea,
        unitCode: "ACR",
      },
    }),

    ...(project.reraId && {
      identifier: {
        "@type": "PropertyValue",
        name: "RERA ID",
        value: project.reraId,
      },
    }),

    ...(project.faqList?.length > 0 && {
      mainEntity: project.faqList.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    }),
  };
}

// ==========================
// Page Component
// ==========================
export default async function Page({ params }) {
  const {pSlug} = await params;

  const project = await fetchProject(pSlug);

  if (!project) {
    return <div className="p-10 text-center">Project Not Found</div>;
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateJsonLd(project)),
        }}
      />

      <ProjectViewPage projectData={project} />
    </>
  );
}