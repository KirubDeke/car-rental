'use client';

import Image from 'next/image';
import React from 'react';
import ButtonOne from './ui/ButtonOne';
import ButtonTwo from './ui/ButtonTwo';

const HeroSection: React.FC = () => {
  return (
    <section className="bg-background dark:bg-background text-foreground dark:text-foreground px-12">
      <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
        <div className="mr-auto place-self-center lg:col-span-7">
          <h1
            style={{ fontFamily: 'Orbitron, sans-serif' }}
            className="font-orbitron max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl"
          >
            Drive with Ease – <span className="text-red-500">Kirub </span>Car Rental
          </h1>
          <p className="max-w-2xl mb-6 text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
            Reliable cars. Great prices. Easy booking.
          </p>
          <ButtonOne className="text-lg px-6 py-3" children={"Book Now"} />
          <ButtonTwo className="text-lg px-6 py-3" children={"Contact Us"} />
        </div>

        <div className="hidden lg:mt-0 lg:col-span-5 lg:flex scale-125 relative">
          {/* Unique Shape Behind */}
          <div
            className="absolute -top-20 -left-20 w-[550px] h-[400px] rounded-full bg-gradient-to-tr from-red-400 via-red-500 to-red-600 opacity-70 blur-3xl -z-10"
            aria-hidden="true"
          />
          <Image
            src="/images/side.png"
            alt="mockup"
            width={1200}
            height={1000}
            className="relative z-10"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
