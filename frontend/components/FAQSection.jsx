import React from "react";

export default function FAQSection({ faqList }) {
  return (
    <section className="py-10">
      <div>
        {/* Header */}
        <div className="flex items-center justify-center mb-8">
          <h4 className="mx-4 text-xl md:text-3xl font-bold">
            Frequently Asked Questions
          </h4>
        </div>

        {/* FAQ List */}
        <div className="space-y-2">
          {faqList?.map((faq, index) => (
            <details
              key={index}
              className="bg-white border-b border-gray-100 shadow-2xl rounded"
            >
              <summary className="cursor-pointer px-6 py-4 text-lg font-medium text-gray-900 hover:bg-gray-50">
                {faq?.question}
              </summary>

              <div className="px-6 pb-4 text-sm text-gray-600 leading-relaxed">
                {faq?.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}