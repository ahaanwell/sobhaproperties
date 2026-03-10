"use client";
import AboutDeveloperSection from "@/components/AboutDeveloperSection";
import AmenitiesSection from "@/components/AmenitiesGrid";
import FAQSection from "@/components/FAQSection";
import FloorPlansSection from "@/components/FloorPlansSection";
import GallerySection from "@/components/GallerySection";
import LoadingSpinner from "@/components/LoadingSpinner";
import LocationMapSection from "@/components/LocationMapSection";
import MasterPlanSection from "@/components/MasterPlanSection";
import PriceListSection from "@/components/PriceListSection";
import ProjectFooter from "@/components/ProjectFooter";
import ProjectHero from "@/components/ProjectHero";
import ProjectOverview from "@/components/ProjectOverview";
import ProjectPageHeader from "@/components/ProjectPageHeader";

function ProjectViewPage({ projectData}) {

  return (
    <>
      <ProjectPageHeader projectName={projectData?.name} projectSlug={projectData?.slug} />
      <ProjectHero
        mainImg={projectData?.mainImage}
        name={projectData?.name}
        location={projectData?.location}
        basePrice={projectData?.basePrice}
        unitVariant={projectData?.unitVariant}
        totalUnits={projectData?.totalUnits}
        totalLandArea={projectData?.totalLandArea}
        totalTowers={projectData?.totalTowers}
      />
      <div className="w-full md:w-[80%] px-4 md:px-0 m-auto">
        <ProjectOverview 
        overviewContent={projectData?.overviewContent}
        totalUnits={projectData?.totalUnits}
        totalLandArea={projectData?.totalLandArea}
        reraId={projectData?.reraId}
        status={projectData?.status}
        possessionTime={projectData?.possessionTime}
        propertyType={projectData?.propertyType}
        />
        <AmenitiesSection />
        <PriceListSection pricePlanContent={projectData?.pricePlanContent} pricePlans={projectData?.pricePlans} projectName={projectData?.name} />
        <FloorPlansSection floorPlanContent={projectData?.floorPlanContent} floorPlans={projectData?.floorPlans} projectName={projectData?.name} />
        <MasterPlanSection masterPlanContent={projectData?.masterPlanContent} masterPlanImage={projectData?.masterPlanImage} />
        <GallerySection galleryImages={projectData?.gallery} />
        <LocationMapSection locationContent={projectData?.locationContent} mapLink={projectData?.mapLink} />
        <AboutDeveloperSection moreAboutProject={projectData?.moreAbout} />
        <FAQSection faqList={projectData?.faqList} />
      </div>
      <ProjectFooter/>
    </>

  );
}

export default ProjectViewPage;
