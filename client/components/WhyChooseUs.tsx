// components/WhyChooseUs.tsx
import React from 'react';
import Image from 'next/image';
import { Clock, Phone, Star, Car } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      title: "No Delays",
      description: "We guarantee on-time vehicle delivery with our efficient booking system.",
      icon: <Clock className="h-6 w-6" />
    },
    {
      title: "Premium Support",
      description: "24/7 customer service team available for all your rental needs.",
      icon: <Phone className="h-6 w-6" />
    },
    {
      title: "High Quality",
      description: "Impeccably maintained vehicles for your comfort and safety.",
      icon: <Star className="h-6 w-6" />
    },
    {
      title: "Diverse Selection",
      description: "Wide range of vehicles from economy to luxury class.",
      icon: <Car className="h-6 w-6" />
    }
  ];

  return (
    <section className="bg-background dark:bg-background text-foreground dark:text-foreground px-12 py-12">
      <div className="max-w-screen-xl px-4 mx-auto lg:py-16">
        <h2 
          style={{ fontFamily: 'Orbitron, sans-serif' }}
          className="font-orbitron text-2xl font-extrabold tracking-tight mb-12 text-left md:text-3xl xl:text-4xl"
        >
          Why Choose <span className="text-red-500">Us</span>
        </h2>
        
        <div className="grid gap-8 lg:gap-12 lg:grid-cols-12">
          {/* Image on the left - spans 5 columns */}
          <div className="lg:col-span-5 lg:flex relative">
            {/* Unique Shape Behind */}
            <div
              className="absolute -top-20 -left-20 w-[550px] h-[400px] rounded-full bg-gradient-to-tr from-red-400 via-red-500 to-red-600 opacity-70 blur-3xl -z-10"
              aria-hidden="true"
            />
            <div className="relative h-96 w-full rounded-lg overflow-hidden">
              <Image
                src="/images/car-left-two.png"
                alt="Premium rental cars"
                layout="fill"
                objectFit="contain"
                className="transition-transform duration-500 hover:scale-105 relative z-10"
              />
            </div>
          </div>
          
          {/* Content on the right - spans 7 columns with two columns */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors group">
                  <div className="p-2 bg-red-100 rounded-full text-red-500 flex-shrink-0 group-hover:bg-red-200 transition-colors">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground dark:text-white mb-1.5">{feature.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{feature.description}</p>
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