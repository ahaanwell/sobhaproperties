"use client";
import { useState } from "react";
import LeadModal from "./LeadModal";

function ViewDetailsBtn({ item, projectName }) {
    const [openModal, setOpenModal] = useState(false);
      const [modelHeading, setModelHeading] = useState("");
      const [modelBtnLabel, setModelBtnLabel] = useState("");
    
      const openDetails = (item) => {
        setModelHeading(`View ${item?.unitType} Details`);
        setModelBtnLabel("View Details");
        setOpenModal(true);
      };
    
      const openDownload = () => {
        setModelHeading("Download Price List");
        setModelBtnLabel("Download");
        setOpenModal(true);
      };
  return (
    <>
    <button
      onClick={() => openDetails(item)}
      className="bg-primary cursor-pointer text-white text-sm font-semibold px-4 py-2 rounded-md hover:opacity-90 transition"
    >
      View Details
    </button>
    <LeadModal
            isOpen={openModal}
            projectName={projectName}
            modelHeading={modelHeading}
            modelBtnLabel={modelBtnLabel}
            onClose={() => setOpenModal(false)}
          />
    </>
  );
};

export default ViewDetailsBtn;