"use client";
import React, { useState } from "react";
import { Maximize2, Download, MapPin, Building, Trees, Car, Users } from "lucide-react";

export default function MasterPlanSection({masterPlanContent, masterPlanImage}) {

  return (
    <section className="pt-10" id="master-plan">
      <div className="">
        <div className="flex items-center justify-center mb-8">
          <h4 className="mx-4 text-xl md:text-3xl font-bold">
            Master Plan
          </h4>
        </div>

        {masterPlanContent && (
          <div
            className="rich-content"
            dangerouslySetInnerHTML={{ __html: masterPlanContent }}
          />
        )}
        {/* Master Plan Image Card */}
        <div className="w-full md:w-[50%] m-auto h-[300px] md:h-[400px] flex items-center justify-center">
              <img 
                src={masterPlanImage || "/images/masterplan.webp"} 
                alt="Master Plan"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
        {/* Download Button */}
        <div className="text-center mt-8">
          <button className="inline-flex items-center px-6 py-2.5 border-2 border-white bg-primary text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors duration-300 shadow-sm">
            <Download className="w-4 h-4 mr-2" />
            Download Master Plan
          </button>
          <p className="text-xs text-gray-400 mt-3">
            * High-resolution master plan available for download
          </p>
        </div>
      </div>
    </section>
  );
}