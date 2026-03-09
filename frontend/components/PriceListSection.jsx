"use client";
import React, { useState } from "react";
import { Download } from "lucide-react";
import LeadModal from "./LeadModal";

export default function PriceListSection({ pricePlanContent, pricePlans, projectName }) {
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
    <section className="pt-12 pb-16" id="price">
      <div>

        {/* Header */}
        <div className="text-center mb-6">
          <h4 className="text-xl md:text-3xl font-bold">Price List</h4>
        </div>

        <div
          className="rich-content"
          dangerouslySetInnerHTML={{ __html: pricePlanContent }}
        />

        {/* ── Desktop Table (md and above) ── */}
        <div className="hidden md:block overflow-x-auto mt-6">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-primary text-white">
              <tr>
                <th className="border border-gray-300 py-3 px-4 text-left text-sm font-semibold">Unit Type</th>
                <th className="border border-gray-300 py-3 px-4 text-left text-sm font-semibold">Area</th>
                <th className="border border-gray-300 py-3 px-4 text-left text-sm font-semibold">Starting Price</th>
                <th className="border border-gray-300 py-3 px-4 text-center text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {pricePlans?.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 py-4 px-4 font-medium text-gray-800">{item.unitType}</td>
                  <td className="border border-gray-300 py-4 px-4 text-gray-600">{item.area}</td>
                  <td className="border border-gray-300 py-4 px-4 font-semibold text-gray-900">{item.price}</td>
                  <td className="border border-gray-300 py-4 px-4 text-center">
                    <button
                      onClick={() => openDetails(item)}
                      className="bg-primary cursor-pointer text-white text-sm font-semibold px-4 py-2 rounded-md hover:opacity-90 transition"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Mobile Cards (below md) ── */}
        <div className="flex flex-col gap-3 mt-6 md:hidden">
          {pricePlans?.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl overflow-hidden shadow-sm"
            >
              {/* Card header */}
              <div className="bg-primary text-white px-4 py-2.5 flex items-center justify-between">
                <span className="font-semibold text-sm">{item.unitType}</span>
                <span className="text-sm font-bold">{item.price}</span>
              </div>

              {/* Card body */}
              <div className="bg-white px-4 py-3 flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  <span className="block font-medium text-gray-400 uppercase tracking-wide mb-0.5">Area</span>
                  <span className="text-gray-700 font-medium">{item.area}</span>
                </div>
                <button
                  onClick={() => openDetails(item)}
                  className="bg-primary text-white text-xs font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Download Button */}
        <div className="text-center mt-8">
          <button
            onClick={openDownload}
            className="inline-flex cursor-pointer items-center px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:opacity-90 transition shadow-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Price List
          </button>
          <p className="text-xs text-gray-400 mt-3">
            * Prices are indicative. Contact for best offers.
          </p>
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