'use client';

import { useState } from 'react';
import ButtonOne from './ui/ButtonOne';
import { useRouter } from 'next/navigation';

interface FAQItem {
  question: string;
  answer: string;
}

export default function CarRentalFAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const router = useRouter();

  const faqs: FAQItem[] = [
    {
      question: "What documents do I need to rent a car?",
      answer: "You'll need a valid driver's license, a credit card in the renter's name, and proof of insurance (if you're not purchasing ours). For international renters, a passport and sometimes an International Driving Permit may be required."
    },
    {
      question: "What's the minimum age to rent a car?",
      answer: "The minimum age is typically 21, but drivers under 25 may incur a young driver fee. Some premium vehicles may require renters to be 25 or older. We offer special rates for young drivers to make renting more affordable."
    },
    {
      question: "Can I take the rental car across state lines?",
      answer: "Yes, most of our vehicles can be driven across state lines within the continental US. However, some restrictions may apply to certain vehicle classes. Please inform our staff about your travel plans when booking."
    },
    {
      question: "What's included in the rental price?",
      answer: "Our base rate includes unlimited mileage, roadside assistance, and standard insurance coverage. Optional extras like GPS, child seats, or additional insurance can be added during booking or at pickup."
    },
    {
      question: "How does fuel policy work?",
      answer: "We operate on a 'full-to-full' policy. You'll receive the car with a full tank and should return it full to avoid refueling charges. We provide a list of nearby gas stations to make refueling convenient before return."
    },
    {
      question: "What happens if I return the car late?",
      answer: "We offer a 59-minute grace period. After that, late fees equivalent to a full day's rental may apply. If you anticipate being late, please call us—we'll do our best to accommodate you without extra charges when possible."
    }
  ];

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" aria-label="Frequently Asked Questions" className="relative bg-background dark:bg-background py-20 sm:py-32 overflow-hidden">
      {/* Glowing background elements */}
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob dark:opacity-10"></div>
      <div className="absolute -bottom-40 -right-32 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 dark:opacity-10"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <h2
          style={{ fontFamily: 'Orbitron, sans-serif' }}
          className="font-orbitron text-2xl font-extrabold tracking-tight mb-12 text-left md:text-3xl xl:text-4xl text-gray-900 dark:text-white"
        >
          Frequently Asked <span className="text-red-500">Questions</span>
        </h2>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-2">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="relative rounded-2xl bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 p-6 shadow-xl shadow-slate-900/10 ring-1 ring-slate-200/10 hover:ring-blue-200/50 transition-all duration-300"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl opacity-0 group-hover:opacity-50 blur transition-all duration-500 dark:from-blue-900/30 dark:to-purple-900/30"></div>
              <div className="relative">
                <button
                  type="button"
                  className="flex w-full items-center justify-between text-left"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={activeIndex === index}
                >
                  <span className="text-lg font-semibold text-gray-900 dark:text-white sm:text-xl">
                    {faq.question}
                  </span>
                  <span className="ml-6 flex h-7 items-center">
                    <svg
                      className={`h-6 w-6 transform transition-all duration-200 ${activeIndex === index ? 'rotate-180 text-red-500' : 'text-gray-400 dark:text-gray-300'}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${activeIndex === index ? 'max-h-96 mt-4 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="text-gray-600 dark:text-gray-300">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <ButtonOne
          onClick={() => router.push("/contact")}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-red-500 hover:bg-red-600 transition-colors duration-200 dark:focus:ring-offset-gray-900"
          >
            Need more help? Contact Us
            <svg
              className="w-5 h-5 ml-2 -mr-1 group-hover:translate-x-1 transition-transform duration-300"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </ButtonOne>
        </div>
      </div>
    </section>
  );
}