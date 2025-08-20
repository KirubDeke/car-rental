'use client';

import Image from 'next/image';
import React from 'react';
import ButtonOne from './ui/ButtonOne';
import ButtonTwo from './ui/ButtonTwo';
import { useRouter } from 'next/navigation';
import { motion, Variants } from 'framer-motion';


const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const imageVariants: Variants = {
  hidden: { x: 100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const glowVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 0.7,
    transition: {
      duration: 1.5,
      ease: "easeOut",
      delay: 0.5
    }
  }
};

const HeroSection: React.FC = () => {
  const router = useRouter();
  
  return (
    <section className="bg-background dark:bg-background text-foreground dark:text-foreground px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 overflow-hidden">
      <motion.div 
        className="max-w-screen-xl mx-auto grid gap-8 lg:gap-12 xl:gap-16 lg:grid-cols-12 items-center relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Text Content */}
        <motion.div 
          className="lg:col-span-7 text-center lg:text-left z-10"
        >
          <motion.h1
            style={{ fontFamily: 'Orbitron, sans-serif' }}
            className="font-orbitron mb-4 text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-extrabold leading-tight sm:leading-tight md:leading-tight lg:leading-tight"
            variants={itemVariants}
          >
            Drive with Ease – <span className="text-red-500">Kirub </span>Car Rental
          </motion.h1>
          
          <motion.p 
            className="mb-6 sm:mb-8 md:mb-10 text-base sm:text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto lg:mx-0"
            variants={itemVariants}
          >
            Reliable cars. Great prices. Easy booking.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            variants={itemVariants}
          >
            <ButtonOne 
              onClick={() => router.push("/fleets")}
              className="text-base sm:text-lg px-5 py-2.5 sm:px-6 sm:py-3 w-full sm:w-auto transform hover:scale-105 transition-transform duration-300"
            >
              Book Now
            </ButtonOne>
            <ButtonTwo 
              onClick={() => router.push("/contact")}
              className="text-base sm:text-lg px-5 py-2.5 sm:px-6 sm:py-3 w-full sm:w-auto transform hover:scale-105 transition-transform duration-300"
            >
              Contact Us
            </ButtonTwo>
          </motion.div>
        </motion.div>

        {/* Image Content */}
        <motion.div 
          className="lg:col-span-5 mt-8 lg:mt-0 relative flex justify-center z-10"
          variants={imageVariants}
        >
          {/* Color splash positioned specifically behind the car */}
          <motion.div
            className="absolute -top-10 -right-10 w-[120%] h-[120%] bg-gradient-to-tr from-red-400 via-red-500 to-red-600 opacity-70 rounded-[50%] blur-3xl -z-10"
            aria-hidden="true"
            variants={glowVariants}
          />
  
          <motion.div 
            className="relative w-full max-w-md lg:max-w-none lg:scale-125 xl:scale-110"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <Image
              src="/images/side.png"
              alt="Premium rental car"
              width={1200}
              height={1000}
              className="w-full h-auto transform hover:scale-105 transition-transform duration-500"
              priority
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;