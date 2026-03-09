"use client";
import React from "react";
import { Building2 } from "lucide-react";

export default function AboutDeveloperSection({moreAboutProject}) {
  return (
    <section className="pt-10">
      <div className="">
        {/* Simple Header */}
        <div className="flex items-center justify-center mb-8">
          <h4 className="mx-4 text-xl md:text-3xl font-bold">
            About the Developer
          </h4>
        </div>

        {/* Simple Content Card */}
        <div className="">
          <div className="">
            {moreAboutProject && (
          <div
            className="rich-content"
            dangerouslySetInnerHTML={{ __html: moreAboutProject }}
          />
        )}
          </div>
        </div>
      </div>
    </section>
  );
}