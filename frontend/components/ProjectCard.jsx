"use client"
import Link from "next/link";
import { useState } from "react";
import LeadModal from "./LeadModal";
import { toLocalImage } from "@/utils/image";

function ProjectCard({ project }) {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div
      key={project?._id}
      className="bg-white shadow-md overflow-hidden hover:shadow-lg transition"
    >
      {/* Image */}
      <div className="relative h-[180px] md:h-[200px]">
        <img
          src={toLocalImage(project?.mainImage)}
          alt={project?.name}
          className="w-full h-full object-cover"
        />

        {/* Badge */}
        <div className="absolute top-4 left-0">
          <span className="bg-primary text-white text-xs font-semibold px-4 py-1 rounded-r-full shadow-md">
            {project?.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          {project?.name}
        </h3>

        <p className="text-gray-500 text-sm mb-2">
          {project.location} &nbsp; | &nbsp; {project?.unitVariant}
        </p>

        <p className="text-lg font-semibold text-gray-900 mb-4">
          {project?.basePrice}
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <Link
            href={`/${project?.slug}`}
            prefetch
            className="flex-1 border text-center cursor-pointer border-gray-300 py-2 rounded-3xl text-sm hover:bg-gray-100 transition">
            View Details
          </Link>

          <button
            onClick={() => setOpenModal(true)}
            className="flex-1 bg-primary text-white py-2 text-sm rounded-3xl font-medium cursor-pointer shadow-md"
          >
            Get Cost Sheet
          </button>
        </div>
      </div>
      <LeadModal
        isOpen={openModal}
        projectName={project?.name}
        modelHeading={"Download Cost Sheet"}
        modelBtnLabel={"Download"}
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
}

export default ProjectCard;