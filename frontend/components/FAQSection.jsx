"use client";
import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";


export default function FAQSection({faqList}) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-10">
      <div>
        {/* Simple Header */}
        <div className="flex items-center justify-center mb-8">
          <h4 className="mx-4 text-xl md:text-3xl font-bold">
            Frequently Asked Questions
          </h4>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-2">
          {faqList?.map((faq, index) => (
            <div key={index} className="bg-white border-b border-gray-100 shadow-2xl last:border-0">
              {/* Question Button */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-medium text-gray-900 pr-4">
                  {faq?.question}
                </span>
                <ChevronDown 
                  className={`w-5 h-5 text-blue-900 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Answer Panel */}
              <div 
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-40" : "max-h-0"
                }`}
              >
                <div className="px-6 pb-4 text-sm text-gray-600 leading-relaxed">
                  {faq?.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}