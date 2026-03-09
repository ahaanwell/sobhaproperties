"use client";
import {
  FaRegIdCard,
  FaLayerGroup,
  FaBuilding,
  FaHome,
  FaCalendarCheck,
  FaCity,
  FaCalendar,
} from "react-icons/fa";

export default function ProjectOverview({
  overviewContent,
  totalUnits,
  totalLandArea,
  reraId,
  status,
  possessionTime,
  propertyType,
}) {
  return (
    <section id="overview" className=" bg-white mt-10">
      <div className="">
        <div
  className="rich-content"
  dangerouslySetInnerHTML={{ __html: overviewContent }}
/>
      </div>

      {/* Info Card Container */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden mt-6">
        {/* Row 1 */}
        <div className="grid md:grid-cols-3 divide-x divide-gray-200">
          {/* RERA */}
          <div className="flex items-start gap-4 p-6">
            <FaRegIdCard className="text-[#c8952c] text-xl mt-1" />
            <div>
              <p className="text-gray-500 text-sm">RERA ID:</p>
              <p className="font-medium text-[#0F1C2E]">{reraId || ""}</p>
            </div>
          </div>

          {/* Land Area */}
          <div className="flex items-start gap-4 p-6">
            <FaLayerGroup className="text-[#c8952c] text-xl mt-1" />
            <div>
              <p className="text-gray-500 text-sm">Land Area</p>
              <p className="font-medium text-[#0F1C2E]">
                {totalLandArea || ""}
              </p>
            </div>
          </div>

          {/* Units */}
          <div className="flex items-start gap-4 p-6">
            <FaBuilding className="text-[#c8952c] text-xl mt-1" />
            <div>
              <p className="text-gray-500 text-sm">Number of Units</p>
              <p className="font-medium text-[#0F1C2E]">{totalUnits || ""}</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Row 2 */}
        <div className="grid md:grid-cols-3 divide-x divide-gray-200">
          {/*  */}
          <div className="flex items-start gap-4 p-6">
            <FaCalendar className="text-[#c8952c] text-xl mt-1" />
            <div>
              <p className="text-gray-500 text-sm">Possession Time</p>
              <p className="font-medium text-[#0F1C2E]">
                {possessionTime || ""}
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-start gap-4 p-6">
            <FaCalendarCheck className="text-[#c8952c] text-xl mt-1" />
            <div>
              <p className="text-gray-500 text-sm">Status</p>
              <p className="font-medium text-[#0F1C2E]">{status || ""}</p>
            </div>
          </div>

          {/* Property Type */}
          <div className="flex items-start gap-4 p-6">
            <FaHome className="text-[#c8952c] text-xl mt-1" />
            <div>
              <p className="text-gray-500 text-sm">Property Type</p>
              <p className="font-medium text-[#0F1C2E]">{propertyType || ""}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
