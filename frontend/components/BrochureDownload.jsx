"use client";

import { useState, useEffect } from "react";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

export default function BrochureDownload({topPosition, frmName, projectName}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [leadData, setLeadData] = useState({
    name: "",
    email: "",
    number: "",
  });

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeadData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { name, email, number } = leadData;

    const data = {
      name,
      email,
      number,
      company_email: "ahaanwell@gmail.com",
      project_name: projectName,
    };

    try {
      const res = await fetch("https://smtp-server-sepia.vercel.app/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert("Enquiry Submitted Successfully");
        setLeadData({ name: "", email: "", number: ""});
      } else {
        alert("Something went wrong ❌");
      }
    } catch (error) {
      alert("Server Error ❌");
    }

    setLoading(false);
  };


  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Wrapper — slides from left, tab always attached on the right side of panel */}
      <div
        className={`fixed left-0 ${topPosition} -translate-y-1/2 z-50 flex flex-row items-stretch transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-[220px]"
        }`}
      >
        {/* ── Panel ── */}
        <div className="bg-primary rounded shadow-2xl p-3 w-[220px] flex flex-col gap-3">
          <h3 className="text-white text-lg font-bold text-center">Download {frmName}</h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              name="name"
              value={leadData.name}
              onChange={handleChange}
              placeholder="Name"
              required
              className="w-full bg-white rounded-lg px-4 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-white/60"
            />
            <input
              type="tel"
              name="number"
              value={leadData.number}
              onChange={handleChange}
              placeholder="Mobile No"
              required
              className="w-full bg-white rounded-lg px-4 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-white/60"
            />
            <input
              type="email"
              name="email"
              value={leadData.email}
              onChange={handleChange}
              placeholder="E-Mail Address"
              className="w-full bg-white rounded-lg px-4 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-white/60"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-yellow-600 font-bold py-2 rounded-lg transition-colors duration-200 text-sm disabled:opacity-70 cursor-pointer"
            >
              {loading ? "Downloading..." : "Download"}
            </button>
          </form>
        </div>

        {/* ── Tab Button — always attached to right edge of panel ── */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Close brochure panel" : "Open brochure panel"}
          className="bg-primary text-white rounded-r-lg shadow-lg cursor-pointer flex flex-col items-center justify-start gap-2 px-[4px] py-2 self-start mt-0 transition-colors duration-200"
        >

          {/* "Download" on first line, "Broucher" on second line — vertical */}
          <span
            className="text-[13px] font-bold leading-tight text-center"
            style={{ writingMode: "vertical-rl", transform: "rotate(00deg)" }}
          >
            Download <br />{frmName}
          </span>
          {/* Arrow — changes direction based on state */}
          {isOpen ? (
            <FaArrowLeft className="text-white text-sm" />
          ) : (
            <FaArrowRight className="text-white text-sm" />
          )}
        </button>
      </div>
    </>
  );
}