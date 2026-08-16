"use client";

import Link from "next/link";
import { Home, Building2, MapPin, Menu } from "lucide-react";
import { useState } from "react";
import MobileMenuDrawer from "./MobileMenuDrawer";

export default function MobileBottomTab() {

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Bottom Tab */}
      <div className="md:hidden sticky bottom-0 left-0 w-full bg-white  shadow-lg z-40">
        <div className="h-0.5 w-full bg-primary" />
        <div className="flex justify-around items-center py-2">

          <Link href="/" className="tab-link flex flex-col items-center text-[12px] gap-1 text-primary">
            <Home size={23} className="bg-primary text-white font-semibold rounded-full p-1" />
            HOMME
          </Link>

          <Link href="/projects" className="tab-link flex flex-col items-center gap text-[12px] text-primary">
            <Building2 size={23} className="bg-primary text-white font-semibold rounded-full p-1" />
            PROJECTS
          </Link>

          <Link href="/locations" className="tab-link flex flex-col items-center gap-1 text-[12px] text-primary">
            <MapPin size={23} className="bg-primary text-white font-semibold rounded-full p-1" />
            LOCATION
          </Link>

          <button
            onClick={() => setMenuOpen(true)}
            className="tab-link text-primary flex flex-col items-center gap-1"
          >
            <Menu size={23} className="bg-primary text-white font-semibold rounded-full p-1" />
            <span className="text-primary">MENU</span>
          </button>

        </div>

      </div>

      {/* Drawer */}
      <MobileMenuDrawer
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <style jsx>{`
        .tab-link {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 12px;
          color: #555;
        }
      `}</style>

    </>
  );
}
