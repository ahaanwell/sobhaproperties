"use client";

import Image from "next/image";
import { useState } from "react";
import { FaDownload } from "react-icons/fa";
import LeadModal from "./LeadModal";


export default function ProjectHero({mainImg, name, location, basePrice, unitVariant, totalUnits, totalLandArea, totalTowers}) {
  const [openModal, setOpenModal] = useState(false);
  const [modelHeading, setModelHeading] = useState("");
  const [modelBtnLabel, setModelBtnLabel] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(form);
  };



  return (
    <>
    <section className="relative w-full h-[80vh] md:h-[100vh] flex items-center pt-20">

      {/* Background Image */}
      <Image
        src={mainImg}
        alt={`${name}`}
        fill
        priority
        className="object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f1c2e]/40 via-[#0f1c2e]/30 to-transparent"></div>

      {/* Content Container */}
      <div className="relative z-10 mx-auto px-4 md:px-20 w-full grid md:grid-cols-2 gap-10 items-center">

        {/* LEFT SIDE CONTENT */}
        <div className="text-white">

          <h1 className="text-2xl md:text-4xl md:text-5xl font-semibold mb-4">
            {name}
          </h1>

          <p className="text-lg md:text-xl w-fit px-3 py-1 rounded bg-[#0000007d] text-gray-200 mb-3 font-medium">
            {location}
          </p>

          <p className="text-lg md:text-xl px-3 py-1 rounded w-fit bg-[#0000007d] text-gray-200 mb-3 font-medium">
            {unitVariant}
          </p>

          <p className="text-2xl md:text-3xl font-semibold mb-6">
            ₹ {basePrice}
          </p>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row gap-4">

            <button className="
              px-8 py-3
              rounded-full
              bg-primary
              text-white
              font-semibold
              cursor-pointer
            "
            onClick={()=>{
              setModelHeading("Download Cost Sheet")
              setModelBtnLabel("Download")
              setOpenModal(true)
            }}
            >
              Get Cost Sheet
            </button>

            <button 
            onClick={()=>{
              setModelHeading("Download Brochure")
              setModelBtnLabel("Download")
              setOpenModal(true)
            }}
            className="
              px-6 py-3
              rounded-full
              text-black
              transition
              font-semibold
              bg-white
              cursor-pointer
            ">
              <FaDownload className="inline mr-2" />
              Download Brochure
            </button>

          </div>

          <div className="flex justify-between items-center mt-10">
            <div>
              <p className="text-4xl font-bold text-yellow-500">{totalUnits}</p>
              <p>Total Units</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-yellow-500">{totalLandArea}</p>
              <p>Area</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-yellow-500">{totalTowers}</p>
              <p>Towers</p>
            </div>
          </div>

        </div>

        {/* RIGHT SIDE FORM */}
        <div className="md:flex justify-center md:justify-end hidden">

          <div className="bg-white w-full max-w-[400px] rounded-2xl shadow-2xl p-6">

            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Book Your Visit
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                type="text"
                name="name"
                placeholder="Your Name"
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#c8952c]"
              />

              <input
                type="email"
                name="email"
                placeholder="Email ID"
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#c8952c]"
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#c8952c]"
              />

              {/* Checkbox */}
              <label className="flex items-center gap-2 text-sm text-gray-600">

                <input
                  type="checkbox"
                  name="whatsapp"
                  checked={form.whatsapp}
                  onChange={handleChange}
                />

                Receive updates via Whatsapp

              </label>

              {/* Button */}
              <button
                type="submit"
                className="
                cursor-pointer
                  w-full
                  py-3
                  rounded-mg
                  bg-primary
                  text-white
                  font-semibold
                  hover:bg-[#c8952c]
                  transition
                "
              >
                Submit
              </button>

              {/* Disclaimer */}
              <p className="text-xs text-gray-500 text-center mt-2">
                This enquiry is to book site visit and get best price.
              </p>

            </form>

          </div>

        </div>

      </div>

    </section>

        <LeadModal
        isOpen={openModal}
        projectName={name}
        modelHeading={modelHeading}
        modelBtnLabel={modelBtnLabel}
        onClose={() => setOpenModal(false)}
      />

      </>
  );
}
