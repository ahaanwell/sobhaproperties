"use client";
import React from "react";
import { MapPin, Download, Maximize2, Navigation, Car, Train, Plane, ShoppingBag, Hospital } from "lucide-react";

export default function LocationMapSection({locationContent, mapLink}) {
  const map = mapLink || "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d124435.74503022125!2d77.674833!3d12.932318!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae13752e34e92f%3A0xc2b234a66f986aae!2sBellandur%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1767174512692!5m2!1sen!2sin";
  return (
    <section className="pt-10" id="location">
      <div className="">
        {/* Header */}
        <div className="flex items-center justify-center mb-8">
          <h4 className="mx-4 text-xl md:text-3xl font-bold">
            Location & Connectivity
          </h4>
        </div>

        {locationContent && (
          <div
            className="rich-content"
            dangerouslySetInnerHTML={{ __html: locationContent }}
          />
        )}

        {/* Map Container */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-5xl mx-auto">
          <div className="relative">
            {/* Map Image - Replace with actual map */}
            <div className="relative h-[350px] md:h-[450px] bg-gray-200">
              <iframe className="w-full h-full"
                                    src={map}
                                    style={{border:0}} allowFullScreen loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade">
                                </iframe>
            </div>
          </div>
        </div>

        {/* Mobile Download Button */}
        <div className="lg:hidden text-center mt-6">
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl transition-colors shadow-md">
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Download Location Guide</span>
          </button>
        </div>
      </div>
    </section>
  );
}