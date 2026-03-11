"use client";
import React, { useState, useEffect } from "react";
import { Maximize2, Square, Download } from "lucide-react";
import LeadModal from "./LeadModal";
import { toLocalImage } from "@/utils/image";

export default function FloorPlansSection({
  floorPlanContent,
  floorPlans = [],
  projectName,
}) {

  const [activeTab, setActiveTab] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [modelHeading, setModelHeading] = useState("");
  const [modelBtnLabel, setModelBtnLabel] = useState("");

  // Reset tab if floorPlans change
  useEffect(() => {
    if (floorPlans.length > 0) {
      setActiveTab(0);
    }
  }, [floorPlans]);

  const activePlan = floorPlans[activeTab];

  if (!floorPlans.length) {
    return (
      <section id="floor-plans" className="py-10">
        <p className="text-center text-gray-500">
          No floor plans available
        </p>
      </section>
    );
  }

  return (
    <section id="floor-plans">
      <div>

        {/* Header */}
        <div className="flex items-center justify-center mb-8">
          <h4 className="mx-4 text-xl md:text-3xl font-bold">
            Floor Plans
          </h4>
        </div>

        {/* Rich Content */}
        {floorPlanContent && (
          <div
            className="rich-content"
            dangerouslySetInnerHTML={{ __html: floorPlanContent }}
          />
        )}

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {floorPlans.map((plan, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-all ${
                activeTab === index
                  ? "bg-primary border-2 border-white text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {plan?.unitType}
            </button>
          ))}
        </div>

        {/* Main Card */}
        {activePlan && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row">

              {/* Image */}
              <div className="md:w-2/5 h-48 md:h-auto relative">
                {activePlan?.floorPlanImage && (
                  <img
                    src={toLocalImage(activePlan.floorPlanImage)}
                    alt={activePlan.unitType}
                    className="w-full h-full object-cover"
                  />
                )}

                {activePlan?.price && (
                  <div className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                    {activePlan.price}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="md:w-3/5 p-5">

                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {activePlan?.unitType}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {projectName}
                    </p>
                  </div>

                  <button className="text-primary hover:text-blue-800">
                    <Download className="w-4 h-4" />
                  </button>
                </div>

                {/* Area */}
                <div className="flex items-center gap-4 text-sm text-gray-700 mb-4">
                  {activePlan?.area && (
                    <span className="flex items-center gap-1">
                      <Square className="w-3.5 h-3.5 text-gray-400" />
                      {activePlan.area}
                    </span>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <button 
                  onClick={() => {
                setModelHeading("Download Brochure");
                setModelBtnLabel("Download");
                setOpenModal(true);
              }}
                  className="flex-1 bg-primary cursor-pointer text-white text-sm font-semibold py-2 px-3 rounded flex items-center justify-center gap-1">
                    <Maximize2 className="w-3 h-3" />
                    Brochure
                  </button>

                  <button 
                  onClick={() => {
                setModelHeading("Book Site Visit");
                setModelBtnLabel("Book");
                setOpenModal(true);
              }}
                  className="flex-1 border-2 cursor-pointer border-black text-black text-sm font-semibold py-2 px-3 rounded">
                    Site Visit
                  </button>
                </div>

                <p className="text-xs text-gray-400 mt-3">
                  * Prices exclusive of offers • Contact for best deals
                </p>

              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 max-w-3xl mx-auto mt-4">
          {floorPlans.map((plan, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-2 text-center shadow-sm"
            >
              <div className="text-xs font-semibold text-gray-800">
                {plan?.unitType}
              </div>
              <div className="text-[10px] text-gray-500">
                From {plan?.price}
              </div>
            </div>
          ))}
        </div>

      </div>
      <LeadModal
              isOpen={openModal}
              projectName={projectName}
              modelHeading={modelHeading}
              modelBtnLabel={modelBtnLabel}
              onClose={() => setOpenModal(false)}
            />
    </section>
  );
}