"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { HiMenu, HiX } from "react-icons/hi";
import LeadModal from "./LeadModal";

export default function ProjectPageHeader({ projectName, projectSlug }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modelHeading, setModelHeading] = useState("");
  const [modelBtnLabel, setModelBtnLabel] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-100 font-medium ${
          scrolled
            ? "bg-white shadow-lg text-gray-700"
            : "bg-transparent text-white"
        }`}
      >
        <div className="w-full mx-auto px-6 md:px-16 py-2 flex items-center justify-between">
          {/* Logo */}
          <Link href={`/${projectSlug}`}>
            <img
              className=" h-[50px] object-contain"
              src="/images/logo.webp"
              alt="Logo"
            />
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-10 text-[16px] font-medium">
            <Link
              href="#overview"
              className="hover:text-[#C8A951] transition duration-300"
            >
              Overview
            </Link>
            <Link
              href="#amenities"
              className="hover:text-[#C8A951] transition duration-300"
            >
              Amenities
            </Link>
            <Link
              href="#price"
              className="hover:text-[#C8A951] transition duration-300"
            >
              Price
            </Link>
            <Link
              href="#floor-plans"
              className="hover:text-[#C8A951] transition duration-300"
            >
              Floor Plans
            </Link>
            <Link
              href="#master-plan"
              className="hover:text-[#C8A951] transition duration-300"
            >
              Master Plan
            </Link>
            <Link
              href="#location"
              className="hover:text-[#C8A951] transition duration-300"
            >
              Location
            </Link>
            <Link
              href="#gallery"
              className="hover:text-[#C8A951] transition duration-300"
            >
              Gallery
            </Link>
          </nav>

          {/* Desktop Button */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => {
                setModelHeading("Download Brochure");
                setModelBtnLabel("Download");
                setOpenModal(true);
              }}
              className="btn-primary px-6 py-2 rounded-full text-white font-semibold"
            >
              Get Brochure
            </button>
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden text-3xl cursor-pointer z-[60]">
            {mobileMenu ? (
              <HiX onClick={() => setMobileMenu(false)} />
            ) : (
              <HiMenu onClick={() => setMobileMenu(true)} />
            )}
          </div>
        </div>
      </header>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-100 md:hidden ${
          mobileMenu ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setMobileMenu(false)}
      ></div>

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-[75%] max-w-[320px] z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenu ? "translate-x-0" : "-translate-x-full"
        } ${scrolled ? "bg-white text-black" : "bg-[#0F1C2E] text-white"}`}
      >
        <div className="p-6 space-y-6 mt-16">
          <Link
            href="#overview"
            onClick={() => setMobileMenu(false)}
            className="block"
          >
            Overview
          </Link>

          <Link
            href="#amenities"
            onClick={() => setMobileMenu(false)}
            className="block"
          >
            Amenities
          </Link>

          <Link
            href="#price"
            onClick={() => setMobileMenu(false)}
            className="block"
          >
            Price
          </Link>

          <Link
            href="#floor-plans"
            onClick={() => setMobileMenu(false)}
            className="block"
          >
            Floor Plans
          </Link>

          <Link
            href="#master-plan"
            onClick={() => setMobileMenu(false)}
            className="block"
          >
            Master Plan
          </Link>

          <Link
            href="#location"
            onClick={() => setMobileMenu(false)}
            className="block"
          >
            Location
          </Link>

          <Link
            href="#gallery"
            onClick={() => setMobileMenu(false)}
            className="block"
          >
            Gallery
          </Link>

          <div className="pt-6 border-t border-gray-300">
            <button
              onClick={() => {
                setModelHeading("Download Brochure");
                setModelBtnLabel("Download");
                setOpenModal(true);
              }}
              className="w-full bg-primary text-white py-2 rounded-md font-semibold"
            >
              Get Brochure
            </button>
          </div>
        </div>
      </div>
      <LeadModal
        isOpen={openModal}
        projectName={projectName}
        modelHeading={modelHeading}
        modelBtnLabel={modelBtnLabel}
        onClose={() => setOpenModal(false)}
      />
    </>
  );
}
