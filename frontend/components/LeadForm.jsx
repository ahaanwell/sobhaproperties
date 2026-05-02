"use client";
import React, { useState } from "react";

export default function LeadForm({projectName}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      name: form.name,
      email: form.email,
      number: form.phone,
      company_email: "info@searchmyspace.in",
      project_name: `Sobhaproperties: ${projectName}` || "General Enquiry",
    };

    try {
      const res = await fetch("https://worldcity.online/send-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to send");
      alert("Thank You! Our team will reach out to you within 24 hours.")
      setForm({
          name: "",
          email: "",
          phone: "",
        });
      setSubmitted(true);
    } catch (err) {
      setError("Something went wrong. Please try again or call us directly.");
    } finally {
      setLoading(false);
    }
  };
  return (
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
                value={form.name}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#c8952c]"
              />

              <input
                type="email"
                name="email"
                placeholder="Email ID"
                onChange={handleChange}
                value={form.email}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#c8952c]"
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                onChange={handleChange}
                value={form.phone}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#c8952c]"
              />

              {/* Checkbox */}
              <label className="flex items-center gap-2 text-sm text-gray-600">

                <input
                  type="checkbox"
                  name="whatsapp"
                  // checked={form.whatsapp}
                  // onChange={handleChange}
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
                  rounded-lg
                  bg-primary
                  text-white
                  font-semibold
                  hover:bg-[#c8952c]
                  transition
                "
              >
                {loading ? "Submiting..." : "Submit"}
              </button>

              {/* Disclaimer */}
              <p className="text-xs text-gray-500 text-center mt-2">
                This enquiry is to book site visit and get best price.
              </p>

            </form>

          </div>

        </div>
  );
}