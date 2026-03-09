"use client";

import Image from "next/image";
import { CheckCircle } from "lucide-react";

export default function WhySobha() {
  return (
    <section className="bg-[#fff6f6] py-4 mb-8">

      <div className="max-w-[1140px] mx-auto px-4 md:px-16 w-full">

        <div className="grid md:grid-cols-2 items-center gap-10">

          {/* LEFT CONTENT */}
          <div>

            <h2 className="text-[32px] font-semibold text-[#1a2b49] mb-6">
              𝙒𝙝𝙮 𝙎𝙤𝙗𝙝𝙖?
            </h2>

            <ul className="space-y-3">

              <li className="flex items-center gap-3 border-b pb-3">
                <CheckCircle className="bg-[#c9a646] text-white rounded-full" size={20} />
                <span className="text-gray-700 text-[15px]">
                  Backward Integration Model
                </span>
              </li>

              <li className="flex items-center gap-3 border-b pb-3">
                <CheckCircle className="bg-[#c9a646] text-white rounded-full" size={20} />
                <span className="text-gray-700 text-[15px]">
                  World-Class Quality
                </span>
              </li>

              <li className="flex items-center gap-3 border-b pb-3">
                <CheckCircle className="bg-[#c9a646] text-white rounded-full" size={20} />
                <span className="text-gray-700 text-[15px]">
                  High Resale Value
                </span>
              </li>

              <li className="flex items-center gap-3 border-b pb-3">
                <CheckCircle className="bg-[#c9a646] text-white rounded-full" size={20} />
                <span className="text-gray-700 text-[15px]">
                  On-Time Delivery
                </span>
              </li>

              <li className="flex items-center gap-3">
                <CheckCircle className="bg-[#c9a646] text-white rounded-full" size={20} />
                <span className="text-gray-700 text-[15px]">
                  Premium Amenities
                </span>
              </li>

            </ul>

          </div>

          {/* RIGHT IMAGE */}
          <div className="relative w-full h-[280px] md:h-[300px]">

            <Image
              src="/images/why-sobha.png"
              alt="Why Sobha"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="object-cover"
            />

            {/* Left fade effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#f4f4f4] via-transparent to-transparent"></div>

          </div>

        </div>

      </div>

    </section>
  );
}
