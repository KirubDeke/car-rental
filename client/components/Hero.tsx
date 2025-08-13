'use client';

import Image from 'next/image';
import React from 'react';
import ButtonOne from './ui/ButtonOne';
import ButtonTwo from './ui/ButtonTwo';

const HeroSection: React.FC = () => {
  return (
    <section className="bg-background dark:bg-background text-foreground dark:text-foreground px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 overflow-hidden">
      <div className="max-w-screen-xl mx-auto grid gap-8 lg:gap-12 xl:gap-16 lg:grid-cols-12 items-center relative">
        {/* Text Content */}
        <div className="lg:col-span-7 text-center lg:text-left z-10">
          <h1
            style={{ fontFamily: 'Orbitron, sans-serif' }}
            className="font-orbitron mb-4 text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-extrabold leading-tight sm:leading-tight md:leading-tight lg:leading-tight"
          >
            Drive with Ease – <span className="text-red-500">Kirub </span>Car Rental
          </h1>
          <p className="mb-6 sm:mb-8 md:mb-10 text-base sm:text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto lg:mx-0">
            Reliable cars. Great prices. Easy booking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <ButtonOne className="text-base sm:text-lg px-5 py-2.5 sm:px-6 sm:py-3 w-full sm:w-auto">
              Book Now
            </ButtonOne>
            <ButtonTwo className="text-base sm:text-lg px-5 py-2.5 sm:px-6 sm:py-3 w-full sm:w-auto">
              Contact Us
            </ButtonTwo>
          </div>
        </div>

        {/* Image Content */}
        <div className="lg:col-span-5 mt-8 lg:mt-0 relative flex justify-center z-10">
          {/* Color splash positioned specifically behind the car */}
          <div
            className="absolute -top-10 -right-10 w-[120%] h-[120%] bg-gradient-to-tr from-red-400 via-red-500 to-red-600 opacity-70 rounded-[50%] blur-3xl -z-10"
            aria-hidden="true"
          />
          
          {/* Car Image */}
          <div className="relative w-full max-w-md lg:max-w-none lg:scale-125 xl:scale-110">
            <Image
              src="/images/side.png"
              alt="Premium rental car"
              width={1200}
              height={1000}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;