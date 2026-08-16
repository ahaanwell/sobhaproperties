"use client";

import { useRef } from "react";
import ProjectCard from "./ProjectCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function FeaturedProjectsSlider({ projects }) {
  const scrollRef = useRef(null);

  return (
    <div className="max-w-[1140px] mx-auto px-6 md:px-16 w-full">
        <div className="relative mt-6">

      {/* <button onClick={() => scrollRef.current.scrollBy({ left: -380, behavior: "smooth" })}>
        <ChevronLeft />
      </button> */}
       <button
            onClick={() => scrollRef.current.scrollBy({ left: -380, behavior: "smooth" })}
            className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100 transition"
          >
            <ChevronLeft size={24} />
          </button>

      <button 
      onClick={() => scrollRef.current.scrollBy({ left: 380, behavior: "smooth" })}
      className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100 transition"
      >
        <ChevronRight />
      </button>
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
      >
        {projects.map((project) =>
          project?.isActive ? (
            <ProjectCard key={project._id} project={project} />
          ) : null
        )}
      </div>
    </div>
    </div>
  );
}