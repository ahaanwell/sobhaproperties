"use client";
import React, { useState, useEffect } from "react";
import { Maximize2, Square, Download } from "lucide-react";
import LeadModal from "./LeadModal";
import { toLocalImage } from "@/utils/image";
import FloorPlansClient from "./FloorPlansClient";

export default function FloorPlansSection({
  floorPlanContent, floorPlans = [], projectName,
}) {

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
            dangerouslySetInnerHTML={{ __html: floorPlanContent || "" }}
          />
        )}

        <FloorPlansClient floorPlans={floorPlans} projectName={projectName} />

      </div>
    </section>
  );
}