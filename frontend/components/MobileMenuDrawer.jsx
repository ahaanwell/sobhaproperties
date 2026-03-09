"use client";

import Link from "next/link";
import { X } from "lucide-react";

export default function MobileMenuDrawer({ isOpen, onClose }) {

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-[280px] bg-white z-50 shadow-xl transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >

        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">

          <h2 className="text-lg font-semibold text-[#0F1C2E]">
            Sobha Bangalore
          </h2>

          <button onClick={onClose}>
            <X size={22} />
          </button>

        </div>

        {/* Links */}
        <div className="flex flex-col p-4 space-y-4">

          <Link href="/" onClick={onClose} className="menu-link">
            Home
          </Link>

          <Link href="/projects" onClick={onClose} className="menu-link">
            Projects
          </Link>

          <Link href="/locations" onClick={onClose} className="menu-link">
            Locations
          </Link>

          <Link href="/blogs" onClick={onClose} className="menu-link">
            Blogs
          </Link>

          <Link href="/about" onClick={onClose} className="menu-link">
            About
          </Link>

          <Link href="/contact" onClick={onClose} className="menu-link">
            Contact
          </Link>

        </div>

      </div>

      {/* Style */}
      <style jsx>{`
        .menu-link {
          font-size: 16px;
          font-weight: 500;
          color: #333;
          padding-bottom: 8px;
          border-bottom: 1px solid #eee;
        }

        .menu-link:hover {
          color: #0F1C2E;
        }
      `}</style>
    </>
  );
}
