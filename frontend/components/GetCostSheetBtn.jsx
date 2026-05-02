"use client";
import { useState } from "react";
import LeadModal from "./LeadModal";
function GetCostSheetBtn({projectName}){
    const [openModal, setOpenModal] = useState(false);
    return(
        <>
        <button
            onClick={() => setOpenModal(true)}
            className="flex-1 bg-primary text-white py-2 text-sm rounded-3xl font-medium cursor-pointer shadow-md"
          >
            Get Cost Sheet
          </button>
          <LeadModal
        isOpen={openModal}
        projectName={projectName}
        modelHeading={"Download Cost Sheet"}
        modelBtnLabel={"Download"}
        onClose={() => setOpenModal(false)}
      />
        </>
    )
};
export default GetCostSheetBtn;