// components/HeroSection.tsx
'use client'
import {motion} from 'motion/react'
import React from "react";
import Image from "next/image"; // remove this if using React without Next.js
import Button from "./Button";

const HeroSection = () => {
  return (
    <section id="hero" className="relative z-400 text-white min-h-screen flex flex-col justify-center items-center px-6 text-center">

      {/* 🧠 Big Headline */}
      <motion.h1 initial={{opacity: 0, y: -20}} animate={{opacity: 1, y:0}} transition={{duration: .5}} className="text-3xl sm:text-7xl font-semibold leading-snug mb-6">
        Want to grow your <span className="bg-gradient-to-r tracking-tighter font-bold from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">Instagram</span> audience <br className="hidden sm:block" />
        & generate real leads? We can help.
      </motion.h1>

      {/* 📝 Description */}
      <motion.p initial={{opacity: 0, y: 20}} animate={{opacity: 1, y:0}} transition={{duration: .6, delay: 0.3}} className="text-gray-300 max-w-xl text-base sm:text-lg mb-8">
        At <span className="text-secondry font-semibold">YourMedia</span>, we help brands & creators grow faster on Instagram by creating content strategies, building loyal followings, and turning followers into paying customers — organically.
      </motion.p>
      <Image
        src="/instagram.svg"
        alt="Instagram"
        width={100}
        height={100}
        className="mx-auto absolute top-[8%] -rotate-12 left-0 translate-x-[-50%] -z-10 size-[100px] sm:size-[200px] md:size-[400px]"
      />
      <Image
        src="/instagram.svg"
        alt="Instagram"
        width={100}
        height={100}
        className="mx-auto absolute bottom-[10%] -rotate-12 right-0 translate-x-[80%] -z-10 size-[100px] sm:size-[200px] md:size-[400px]"
      />
      {/* 📞 CTA Button */}
      <Button 
        label="Schedule a Free Call" 
        data-cal-namespace="30min"
        data-cal-link="yourakshaw/30min"
        data-cal-config='{"layout": "month_view"}'
      />
    </section>
  );
};

export default HeroSection;
