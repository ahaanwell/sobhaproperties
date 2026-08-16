import Amenities from "@/components/Amenities";
import Disclaimer from "@/components/Disclaimer";
import FeaturedProjects from "@/components/FeaturedProjects";
import HeroSection from "@/components/HeroSection";
import MainLayout from "@/components/MainLayout";
import MarketInsights from "@/components/MarketInsights";
import ProjectsByLocation from "@/components/ProjectsByLocation";
import WhySobha from "@/components/WhySobha";

async function getProjects() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
    cache: "no-store",
  });

  if (!res.ok) return [];

  const data = await res.json();
  return data?.data || [];
}

async function fetchBlogs() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs`, {
    cache: "no-store",
  });

  if (!res.ok) return [];

  const data = await res.json();
  return data?.data || [];
}

export default async function Home() {

  const [projects, blogs] = await Promise.all([
    getProjects(),
    fetchBlogs()
  ]);

  return (
    <MainLayout>
      <HeroSection />

      <FeaturedProjects projects={projects} />

      <ProjectsByLocation />

      <WhySobha />

      <Amenities />

      <MarketInsights blogsList={blogs} />

      <Disclaimer />
    </MainLayout>
  );
}