"use client";
import { FaDownload } from "react-icons/fa";
import { useState } from "react";
import LeadModal from "./LeadModal";

function HeroBtn({ project_name }) {
  const [openModal, setOpenModal] = useState(false);
  const [modelHeading, setModelHeading] = useState("");
  const [modelBtnLabel, setModelBtnLabel] = useState("");
  return (
    <>
      <div className="flex flex-col px-5 md:px-0 md:flex-row gap-4">
        <button
          className="
                  px-8 py-3
                  rounded-full
                  bg-primary
                  text-white
                  font-semibold
                  cursor-pointer
                "
          onClick={() => {
            setModelHeading("Download Cost Sheet");
            setModelBtnLabel("Download");
            setOpenModal(true);
          }}
        >
          Get Cost Sheet
        </button>

        <button
          onClick={() => {
            setModelHeading("Download Brochure");
            setModelBtnLabel("Download");
            setOpenModal(true);
          }}
          className="
                  px-6 py-3
                  rounded-full
                  text-black
                  transition
                  font-semibold
                  bg-white
                  cursor-pointer
                "
        >
          <FaDownload className="inline mr-2" />
          Download Brochure
        </button>
      </div>
      <LeadModal
        isOpen={openModal}
        projectName={project_name}
        modelHeading={modelHeading}
        modelBtnLabel={modelBtnLabel}
        onClose={() => setOpenModal(false)}
      />
    </>
  );
}

export default HeroBtn;
