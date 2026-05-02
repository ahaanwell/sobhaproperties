// FeaturedProjects.jsx (NO "use client")

import FeaturedProjectsSlider from "./FeaturedProjectsClient";


export default function FeaturedProjects({ projects }) {
  return (
    <section className="bg-[#fff6f6] py-10">
      <h2 className="text-3xl text-center font-bold">
        Featured Projects
      </h2>

      {/* Server-rendered content (SEO) */}
      <div className="hidden">
        {projects.map((p) => (
          <a key={p._id} href={`/bangalore/${p.slug}`}>
            {p.name} - {p.location} - {p.basePrice}
          </a>
        ))}
      </div>

      {/* Client slider (UI only) */}
      <FeaturedProjectsSlider projects={projects} />
    </section>
  );
}