import AboutDeveloperSection from "@/components/AboutDeveloperSection";
import AmenitiesGrid from "@/components/AmenitiesGrid";
import FAQSection from "@/components/FAQSection";
import FloorPlansSection from "@/components/FloorPlansSection";
import GallerySection from "@/components/GallerySection";
import LeadForm from "@/components/LeadForm";
import LocationMapSection from "@/components/LocationMapSection";
import MasterPlanSection from "@/components/MasterPlanSection";
import PriceListSection from "@/components/PriceListSection";
import ProjectHero from "@/components/ProjectHero";
import ProjectOverview from "@/components/ProjectOverview";
import ProjectPageHeader from "@/components/ProjectPageHeader";
import ProjectTabs from "@/components/ProjectTabs";

function Page() {
  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <ProjectPageHeader/>
      <ProjectHero />
      <div className="w-[80%] m-auto">
        <ProjectOverview />
          <AmenitiesGrid projectName="Sobha Royal Crest" />
          <PriceListSection />
          <FloorPlansSection />
          <MasterPlanSection />
          <GallerySection />
          <LocationMapSection />
          <AboutDeveloperSection />
          <FAQSection />
      </div>
    </div>
  );
}

export default Page;