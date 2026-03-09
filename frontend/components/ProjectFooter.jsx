"use client";
import React from "react";

export default function ProjectFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-10">
      
      {/* Top Section */}
      <div className="w-full mx-auto px-6 py-10">

        {/* Logo / Name */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-white">
            SOBHA PROPERTIES
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            Authorized Marketing Partner
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-6"></div>

        {/* Disclaimer */}
        <div className="text-xs leading-relaxed text-gray-400 space-y-4">

          <p>
            <strong className="text-gray-300">
              Disclaimer & Privacy Policy:
            </strong>{" "}
            That the content published on this website is for informational
            purposes only and may not constitute as an offer or invitation or
            advice for the purpose of purchase/booking/sale of any project.
            Please note that this is the official website of an authorized
            marketing partner.
          </p>

          <p>
            We do not claim ownership or responsibility for the accuracy,
            completeness, or reliability of any information sourced from third
            party website or provided by any third party, and are not
            responsible for any dealing, negotiations, transactions, etc.,
            whatsoever between the investors and developers connected through
            our services, including and not limited to any quality assurances,
            guarantees, schemes, claims, benefits, assured returns etc.,
            given by one party to another in any transaction.
          </p>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800 text-center text-sm text-gray-400 py-4">
        © {new Date().getFullYear()} Your Company Name. All Rights Reserved.
      </div>

    </footer>
  );
}