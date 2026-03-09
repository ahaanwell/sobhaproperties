"use client";

import { useState, useEffect, useRef } from "react";
import { X, Phone, MessageCircle, ArrowRight, Loader2 } from "lucide-react";

export default function LeadModal({
  isOpen,
  onClose,
  projectName,
  modelHeading = "Enquire Now",
  modelBtnLabel = "Submit Enquiry",
}) {
  const companyEmail = "ahaanwell@gmail.com";
  const contactNumber = "919999999999"; 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "+91",
  });
  const [focused, setFocused] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [animIn, setAnimIn] = useState(false);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setAnimIn(true), 10);
      document.body.style.overflow = "hidden";
    } else {
      setAnimIn(false);
      setSubmitted(false);
      setError("");
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      country_code: formData.countryCode,
      company_email: companyEmail,
      project_name: projectName || "General Enquiry",
    };

    try {
      const res = await fetch("https://smtpwithexcel.vercel.app/send-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to send");

      setSubmitted(true);
      setFormData({
          name: "",
          email: "",
          number: "",
          countryCode: "+91(IND)",
        });
      setTimeout(() => { onClose(); setSubmitted(false); }, 2500);
    } catch (err) {
      setError("Something went wrong. Please try again or call us directly.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const fields = [
    { key: "name",  label: "Full Name",     type: "text",  placeholder: "e.g. Arjun Sharma" },
    { key: "email", label: "Email Address", type: "email", placeholder: "e.g. arjun@email.com" },
    { key: "phone", label: "Phone Number",  type: "tel",   placeholder: "e.g. 98765 43210" },
  ];

  return (
    <div
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && onClose()}
      className={`fixed inset-0 z-[999] flex items-center justify-center px-4
        transition-all duration-300
        ${animIn ? "bg-black/70 backdrop-blur-sm" : "bg-transparent backdrop-blur-none"}`}
    >
      {/* Modal card */}
      <div
        className={`relative w-full max-w-md bg-white overflow-hidden shadow-2xl
          transition-all duration-500
          ${animIn ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-95"}`}
      >
        {/* Top accent stripe */}
        <div className="h-1 w-full bg-primary" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-3.5 right-3.5 w-8 h-8 rounded-full bg-stone-100
            hover:bg-stone-200 flex items-center justify-center
            text-stone-400 hover:text-stone-700 transition-colors"
        >
          <X size={14} />
        </button>

        {/* ── Success state ── */}
        {submitted ? (
          <div className="flex flex-col items-center text-center py-14 px-8">
            <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl mb-5">
              ✓
            </div>
            <h3 className="text-2xl font-semibold text-stone-800 mb-2">Thank You!</h3>
            <p className="text-sm text-stone-500 leading-relaxed">
              Our team will reach out to you within 24 hours.
            </p>
          </div>
        ) : (
          <>
            {/* ── Header ── */}
            <div className="flex items-start gap-4 px-7 pt-7 pb-5 border-b border-stone-100">
              <div className="w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 bg-primary text-white">
                <ArrowRight size={19} />
              </div>
              <div>
                {projectName && (
                  <p className="text-[10px] font-semibold tracking-widest uppercase text-stone-400 mb-1">
                    {projectName}
                  </p>
                )}
                <h2 className="text-2xl font-semibold text-stone-800 leading-snug">
                  {modelHeading}
                </h2>
              </div>
            </div>

            {/* ── Form body ── */}
            <div className="px-7 pt-6 pb-7">
              <form onSubmit={handleSubmit} className="space-y-4">

                {fields.map(({ key, label, type, placeholder }) => (
                  <div key={key}>
                    <label
                      className={`block text-[10px] font-semibold tracking-widest uppercase mb-1.5 transition-colors
                        ${focused === key ? "text-primary" : "text-stone-400"}`}
                    >
                      {label}
                    </label>

                    {/* Phone field gets a country code prefix */}
                    {key === "phone" ? (
                      <div className={`flex border rounded-sm overflow-hidden transition-all duration-200
                        ${focused === key
                          ? "border-primary ring-2 ring-primary/10 bg-white"
                          : "border-stone-200 hover:border-stone-300 bg-stone-50"}`}
                      >
                        <select
                          name="countryCode"
                          value={formData.countryCode}
                          onChange={handleChange}
                          onFocus={() => setFocused(key)}
                          onBlur={() => setFocused(null)}
                          className="text-sm text-stone-700 bg-stone-100 border-r border-stone-200
                            px-2 py-3 outline-none cursor-pointer"
                        >
                          <option value="+91">🇮🇳 +91</option>
                          <option value="+1">🇺🇸 +1</option>
                          <option value="+44">🇬🇧 +44</option>
                          <option value="+971">🇦🇪 +971</option>
                          <option value="+65">🇸🇬 +65</option>
                          <option value="+61">🇦🇺 +61</option>
                        </select>
                        <input
                          type="tel"
                          name="phone"
                          required
                          placeholder={placeholder}
                          value={formData.phone}
                          onChange={handleChange}
                          onFocus={() => setFocused(key)}
                          onBlur={() => setFocused(null)}
                          className="flex-1 text-sm text-stone-800 placeholder-stone-300 bg-transparent
                            px-4 py-3 outline-none"
                        />
                      </div>
                    ) : (
                      <input
                        type={type}
                        name={key}
                        required
                        placeholder={placeholder}
                        value={formData[key]}
                        onChange={handleChange}
                        onFocus={() => setFocused(key)}
                        onBlur={() => setFocused(null)}
                        className={`w-full text-sm text-stone-800 placeholder-stone-300 bg-stone-50
                          border rounded-sm px-4 py-3 outline-none transition-all duration-200
                          ${focused === key
                            ? "border-primary ring-2 ring-primary/10 bg-white"
                            : "border-stone-200 hover:border-stone-300"}`}
                      />
                    )}
                  </div>
                ))}

                {/* Error message */}
                {error && (
                  <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-sm px-3 py-2">
                    {error}
                  </p>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full cursor-pointer bg-primary flex items-center justify-center gap-2
                    text-white text-sm font-medium tracking-wide
                    py-3.5 rounded-sm mt-1
                    transition-all duration-200
                    hover:-translate-y-0.5 hover:opacity-90 hover:shadow-lg active:translate-y-0
                    disabled:opacity-70 disabled:cursor-not-allowed disabled:translate-y-0"
                >
                  {loading ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      {modelBtnLabel}
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-stone-100" />
                <span className="text-[10px] font-medium tracking-widest uppercase text-stone-300">
                  or reach us directly
                </span>
                <div className="flex-1 h-px bg-stone-100" />
              </div>

              {/* Call / WhatsApp */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:+${contactNumber}`}
                  className="flex items-center justify-center gap-2
                    py-2.5 rounded-sm text-sm font-medium
                    bg-blue-50 text-blue-600 border border-blue-100
                    hover:bg-blue-100 hover:-translate-y-0.5 hover:shadow-md
                    transition-all duration-200"
                >
                  <Phone size={14} />
                  Call Now
                </a>
                <a
                  href={`https://wa.me/${contactNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2
                    py-2.5 rounded-sm text-sm font-medium
                    bg-green-50 text-green-600 border border-green-100
                    hover:bg-green-100 hover:-translate-y-0.5 hover:shadow-md
                    transition-all duration-200"
                >
                  <MessageCircle size={14} />
                  WhatsApp
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}