"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function HeroSection() {
  const images = [
    "/images/hero12.png",
    "/images/sobhascarlet.jpg",
    "/images/why-sobha.png",
  ];

  const [current, setCurrent] = useState(0);
  const [textVisible, setTextVisible] = useState(true);
  const slideRef = useRef(null);

  const nextSlide = () => {
    setTextVisible(false);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % images.length);
      setTextVisible(true);
    }, 400);
  };

  const goTo = (index) => {
    if (index === current) return;
    setTextVisible(false);
    setTimeout(() => {
      setCurrent(index);
      setTextVisible(true);
    }, 400);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [current]);

  return (
    <section className="relative w-full h-[90vh] md:h-[100vh] min-h-[500px] overflow-hidden">

      {/* ── Slider Track ──
          Key fix: track is position:relative (normal flow), fills the section.
          Each slide is exactly 100vw. Track shifts by multiples of 100vw.  */}
      <div
        ref={slideRef}
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}vw)` }}
      >
        {images.map((img, index) => (
          <div
            key={index}
            className="relative h-full flex-shrink-0"
            style={{ width: "100vw" }}
          >
            <Image
              src={img}
              alt={`Sobha Luxury slide ${index + 1}`}
              fill
              priority={index === 0}
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* ── Overlays ── */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#080e18]/75 via-[#080e18]/40 to-[#080e18]/10" />
      <div className="absolute bottom-0 left-0 right-0 h-40 z-10 bg-gradient-to-t from-[#080e18]/60 to-transparent" />

      {/* ── Main Content ── */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-28 pt-24 md:pt-20">
        <div className="max-w-[680px]">

          {/* Eyebrow */}
          {/* <div
            className={`flex items-center gap-3 mb-6 transition-all duration-700 ease-out
              ${textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
            style={{ transitionDelay: "0.1s" }}
          >
            <span className="text-[11px] tracking-[0.28em] font-medium uppercase text-[#c79a3b]">
              Sobha Realty · Bangalore
            </span>
          </div> */}

          {/* Gold accent line */}
          {/* <div
            className={`h-px bg-[#c79a3b] mb-7 transition-all duration-[1200ms] ease-out
              ${textVisible ? "w-[60px]" : "w-0"}`}
            style={{ transitionDelay: "0.15s" }}
          /> */}

          {/* Heading */}
          <h1
            className={`text-white leading-[1.08] tracking-tight font-light
              text-[2.4rem] sm:text-[3rem] md:text-[4rem] lg:text-[5rem]
              [font-family:'Cormorant_Garamond',serif]
              transition-all duration-700 ease-out
              ${textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
            style={{ transitionDelay: "0.25s" }}
          >
            Where Luxury
            <br />
            <span className="italic font-normal">Finds Its Home</span>
          </h1>

          {/* Sub text */}
          <p
            className={`mt-5 text-gray-300 font-light leading-[1.7] tracking-wide max-w-[440px]
              text-[0.85rem] sm:text-[0.92rem] md:text-[1rem]
              transition-all duration-700 ease-out
              ${textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
            style={{ transitionDelay: "0.38s" }}
          >
            Premium 1, 2, 3 &amp; 4 BHK residences crafted with uncompromising
            attention to details
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col md:flex-row  gap-3 mt-8 transition-all duration-700 ease-out
              ${textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
            style={{ transitionDelay: "0.5s" }}
          >
            <Link
            href="/projects"
              className="px-7 py-3 text-[11px] font-semibold tracking-[0.12em] uppercase text-white
                bg-primary border-0 cursor-pointer
                transition-all duration-300 hover:opacity-85 hover:-translate-y-px"
            >
              View All Projects
            </Link>

            <button
              className="px-7 py-3 text-[11px] font-medium tracking-[0.12em] uppercase text-[#e8c97a]
                bg-transparent border border-[#c79a3b]/70 cursor-pointer
                transition-all duration-300 hover:border-[#c79a3b] hover:text-white hover:bg-[#c79a3b]/10"
            >
              Download Brochure
            </button>
          </div>

          {/* Stats */}
          <div
            className={`flex items-center gap-6 mt-12 transition-all duration-700 ease-out
              ${textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
            style={{ transitionDelay: "0.62s" }}
          >
            {[
              { value: "35+",  label: "Projects" },
              { value: "25K+", label: "Happy Families" },
              { value: "15+",  label: "Years Legacy" },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-6">
                {i > 0 && <div className="w-px h-8 bg-white/20" />}
                <div>
                  <div className="text-white text-[1.6rem] font-normal leading-none [font-family:'Cormorant_Garamond',serif]">
                    {stat.value}
                  </div>
                  <div className="text-[10px] tracking-[0.15em] uppercase mt-1 text-white/50">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ── Vertical Slide Indicators (right) ── */}
      <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3 items-center">
        {images.map((_, index) => (
          <div
            key={index}
            onClick={() => goTo(index)}
            className={`w-0.5 rounded-sm cursor-pointer transition-all duration-500
              ${index === current ? "h-9 bg-[#c79a3b]" : "h-5 bg-white/30 hover:bg-white/50"}`}
          />
        ))}
      </div>

      {/* ── Slide Counter (bottom right) ── */}
      <div className="absolute bottom-8 right-6 md:right-10 z-20 flex items-center gap-1 text-white/40 text-sm tracking-widest [font-family:'Cormorant_Garamond',serif]">
        <span className="text-[#c79a3b] font-medium">0{current + 1}</span>
        <span className="mx-1">/</span>
        <span>0{images.length}</span>
      </div>

      {/* ── Scroll Hint (bottom center, desktop only) ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-2">
        <span className="text-[9px] tracking-[0.22em] uppercase text-white/35">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent animate-bounce" />
      </div>

    </section>
  );
}