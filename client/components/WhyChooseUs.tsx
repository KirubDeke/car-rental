"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Clock, Phone, Star, Car } from "lucide-react";

const WhyChooseUs = () => {
  const [isVisible, setIsVisible] = useState(false);
  const features = [
    {
      title: "No Delays",
      description:
        "We guarantee on-time vehicle delivery with our efficient booking system.",
      icon: <Clock className="h-6 w-6" />,
    },
    {
      title: "Premium Support",
      description:
        "24/7 customer service team available for all your rental needs.",
      icon: <Phone className="h-6 w-6" />,
    },
    {
      title: "High Quality",
      description:
        "Impeccably maintained vehicles for your comfort and safety.",
      icon: <Star className="h-6 w-6" />,
    },
    {
      title: "Diverse Selection",
      description: "Wide range of vehicles from economy to luxury class.",
      icon: <Car className="h-6 w-6" />,
    },
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="bg-background dark:bg-background text-foreground dark:text-foreground px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 overflow-hidden">
      <div className="max-w-screen-xl mx-auto">
        <div className="mb-12 lg:mb-16">
          <h2
            style={{ fontFamily: "Orbitron, sans-serif" }}
            className="font-orbitron text-2xl font-extrabold tracking-tight mb-12 text-left md:text-3xl xl:text-4xl"
          >
            Why Choose <span className="text-red-500">Us</span>
          </h2>
        </div>

        <div className="grid gap-8 lg:gap-12 xl:gap-16 lg:grid-cols-12 items-center relative">
          <div
            className={`lg:col-span-5 mt-8 lg:mt-0 relative flex justify-center z-10 transition-all duration-1000 transform ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0"
            }`}
          >
            {/* Car Image */}
            <div className="relative w-full max-w-md lg:max-w-none lg:scale-125 xl:scale-110">
              <Image
                src="/images/car-left-two.png"
                alt="Premium rental cars"
                width={1200}
                height={1000}
                className="w-full h-auto transform hover:scale-105 transition-transform duration-500"
                priority
              />
            </div>
          </div>

          {/* Content on the right - spans 7 columns */}
          <div className="lg:col-span-7 z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-4 p-4 bg-whiteColor dark:bg-darkColor hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-500 transform group ${
                    isVisible
                      ? "translate-y-0 opacity-100 scale-100"
                      : "translate-y-6 opacity-0 scale-95"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="p-2 bg-red-100 rounded-full text-red-500 flex-shrink-0 group-hover:bg-red-200 transition-colors">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground dark:text-black mb-1.5">
                      {feature.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
