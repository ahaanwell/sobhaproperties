"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { HiMenu, HiX } from "react-icons/hi";
import { FiPhone } from "react-icons/fi";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 h-[60px] flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center text-2xl font-semibold tracking-[4px] leading-none transition-colors duration-300 ${
            scrolled ? "text-black" : "text-white"
          }`}
        >
          SOBHA
          <span className="text-xs tracking-[3px] leading-none">
            𝒫𝓇𝑜𝓅𝑒𝓇𝓉𝒾𝑒𝓈
          </span>
        </Link>

        {/* Desktop Menu */}
        <nav
          className={`hidden md:flex items-center gap-10 text-[13px] font-medium transition-colors duration-100 ${
            scrolled ? "text-gray-800" : "text-white"
          }`}
        >
          <Link href="/">HOME</Link>
          <Link href="/projects">PROJECTS</Link>
          <Link href="#">LOCATIONS</Link>
          <Link href="#">BLOGS</Link>
          <Link href="#">ABOUT US</Link>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          {/* Brochure Button */}
          <Link
            href="#"
            className="
              bg-primary px-6 py-1.5 rounded-full text-[13px] text-white font-semibold
            "
          >
            CONTACT US
          </Link>
        </div>
      </div>
    </header>
  );
}
