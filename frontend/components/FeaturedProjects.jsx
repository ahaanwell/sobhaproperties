"use client";
// import {useDispatch, useSelector} from "react-redux";
import SectionHeading from "./SectionHeading";
import { useState, useRef, useEffect } from "react";
import LeadModal from "./LeadModal";
import ProjectCard from "./ProjectCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
// import { fetchProjects } from "@/redux/slices/projectSlice";

export default function FeaturedProjects({projects}) {
  // const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");

  // const {projects} = useSelector((state)=>state.project);
  console.log("projects", projects)

  const scrollRef = useRef(null);

  const handleOpen = (project) => {
    setSelectedProject(project);
    setOpenModal(true);
  };

  // scroll left
  const scrollLeft = () => {
    scrollRef.current.scrollBy({
      left: -380, // card width
      behavior: "smooth",
    });
  };

  // scroll right
  const scrollRight = () => {
    scrollRef.current.scrollBy({
      left: 380,
      behavior: "smooth",
    });
  };


  // useEffect(()=>{
  //   dispatch(fetchProjects());
  // }, [dispatch]);
  return (
    <section className="bg-[#fff6f6] py-10">

      <div className="max-w-[1140px] mx-auto px-6 md:px-16 w-full">

        <SectionHeading title="𝙁𝙚𝙖𝙩𝙪𝙧𝙚𝙙 𝙋𝙧𝙤𝙟𝙚𝙘𝙩𝙨" />

        <div className="relative mt-6">

          {/* Left Arrow */}
          <button
            onClick={scrollLeft}
            className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100 transition"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Scroll Container */}
          <div
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide"
          >
            {projects.map((project) => (
              <div
                key={project._id}
                className="snap-start shrink-0 w-[290px] md:w-[330px]"
              >
                <ProjectCard
                  project={project}
                  onOpen={() => handleOpen(project.name)}
                />
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={scrollRight}
            className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100 transition"
          >
            <ChevronRight size={24} />
          </button>

        </div>

      </div>

      <LeadModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        projectName={selectedProject}
      />

    </section>
  );
}
