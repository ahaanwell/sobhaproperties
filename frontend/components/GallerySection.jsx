"use client";
import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, Camera } from "lucide-react";
import { toLocalImage } from "@/utils/image";

export default function GallerySection({ galleryImages }) {
  const [currentIndex, setCurrentIndex] = useState(null);

  const openLightbox = (index) => {
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setCurrentIndex(null);
  };

  const nextImage = () => {
    const newIndex = (currentIndex + 1) % galleryImages.length;
    setCurrentIndex(newIndex);
  };

  const prevImage = () => {
    const newIndex =
      (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    setCurrentIndex(newIndex);
  };

  return (
    <section className="pt-10" id="gallery">
      <div>
        {/* Header */}
        <div className="flex items-center justify-center mb-8">
          <h4 className="mx-4 text-xl md:text-3xl font-bold">Gallery</h4>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[180px] md:auto-rows-[200px]">
          {galleryImages?.map((image, index) => (
            <div
              key={index}
              onClick={() => openLightbox(index)}
              className={`group relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer ${
                index % 5 === 0 ? "col-span-2" : "col-span-1"
              }`}
            >
              <img
                src={toLocalImage(image)}
                alt="gallery"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Camera Icon */}
              <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-full p-3 transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 shadow-lg">
                <Camera className="w-5 h-5 text-blue-900" />
              </div>

              {/* Image Number */}
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                {String(index + 1).padStart(2, "0")}
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {currentIndex !== null && (
          <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white/80 hover:text-white bg-black/30 hover:bg-black/50 rounded-full p-3 transition-all z-10 backdrop-blur-sm"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev */}
            <button
              onClick={prevImage}
              className="absolute left-6 text-white/80 hover:text-white bg-black/30 hover:bg-black/50 rounded-full p-3 transition-all backdrop-blur-sm"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next */}
            <button
              onClick={nextImage}
              className="absolute right-6 text-white/80 hover:text-white bg-black/30 hover:bg-black/50 rounded-full p-3 transition-all backdrop-blur-sm"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image */}
            <div className="relative max-w-6xl max-h-[85vh] px-4">
              <img
                src={toLocalImage(galleryImages[currentIndex])}
                alt="gallery"
                className="w-full h-full object-contain rounded-lg"
              />

              {/* Bottom Navigation */}
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-md text-white px-8 py-4 rounded-full flex items-center gap-8 shadow-2xl">
                <button
                  onClick={prevImage}
                  className="hover:text-blue-400 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <span className="text-sm font-medium">
                  {String(currentIndex + 1).padStart(2, "0")} /{" "}
                  {String(galleryImages.length).padStart(2, "0")}
                </span>

                <button
                  onClick={nextImage}
                  className="hover:text-blue-400 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}