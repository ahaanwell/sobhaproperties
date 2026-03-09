"use client";

import { useState } from "react";

export default function ProjectTabs() {

  const tabs = [
    "Overview",
    "Amenities",
    "Floor Plans",
    "Gallery",
    "Video",
    "Location Map",
    "Cost Sheet",
    "FAQs",
  ];

  const [active, setActive] = useState("Overview");

  return (
    <section className="w-full bg-[#f5f5f5] border-b border-gray-300 sticky top-15 z-50">

      <div className="">

        <div className="flex items-center gap-8 overflow-x-auto scrollbar-hide">

          {tabs.map((tab) => (

            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`
                relative
                py-4
                text-sm md:text-[15px]
                font-medium
                whitespace-nowrap
                transition-all
                duration-200

                ${active === tab
                  ? "text-[#0F1C2E]"
                  : "text-gray-600 hover:text-[#0F1C2E]"
                }
              `}
            >

              {tab}

              {/* Active underline */}
              {active === tab && (
                <span className="
                  absolute
                  left-0
                  bottom-0
                  w-full
                  h-[3px]
                  bg-[#0F1C2E]
                  rounded
                "></span>
              )}

            </button>

          ))}

        </div>

      </div>

    </section>
  );
}
