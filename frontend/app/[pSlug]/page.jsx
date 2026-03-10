import { cache } from "react";
import ProjectViewPage from "./ProjectViewPage";
import LoadingSpinner from "@/components/LoadingSpinner";

// ==========================
// Fetch Project (Cached)
// ==========================
const fetchProject = cache(async (slug) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/projects/slug/${slug}`,
      {
        next: { revalidate: 300 },
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    return data?.data;
  } catch (error) {
    console.error("Fetch Project Error:", error);
    return null;
  }
});

// ==========================
// SEO Metadata
// ==========================
export async function generateMetadata({ params }) {
  const { pSlug } = await params;

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
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [ogImage] : [],
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
  const { pSlug } = await params;

  const project = await fetchProject(pSlug);

  // Loading state
  if (!project) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateJsonLd(project)),
        }}
      />

      {/* Project Page */}
      <ProjectViewPage projectData={project} />
    </>
  );
}