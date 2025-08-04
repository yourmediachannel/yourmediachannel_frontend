// components/HeroSection.tsx

import React from "react";
import Image from "next/image"; // remove this if using React without Next.js
import Button from "./Button";

const HeroSection = () => {
  return (
    <section className="relative z-400 text-white min-h-screen flex flex-col justify-center items-center px-6 text-center">
      
      {/* 🔥 Logo at the top */}
      {/* <div className="mb-6">
        <Image
          src="/images/logo.png" // Make sure it's in the /public folder
          alt="YourMedia Logo"
          width={130}
          height={130}
          className="mx-auto"
        />
      </div> */}

      {/* 💬 Subheading */}
      {/* <p className="text-sm sm:text-base text-gray-400 mb-4">
        Social Media Growth Agency for Creators & Startups
      </p> */}

      {/* 🧠 Big Headline */}
      <h1 className="text-3xl sm:text-7xl font-semibold leading-snug mb-6">
        Want to grow your <span className="bg-gradient-to-r tracking-tighter font-bold from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">Instagram</span> audience <br className="hidden sm:block" />
        & generate real leads? We can help.
      </h1>

      {/* 📝 Description */}
      <p className="text-gray-300 max-w-xl text-base sm:text-lg mb-8">
        At <span className="text-secondry font-semibold">YourMedia</span>, we help brands & creators grow faster on Instagram by creating content strategies, building loyal followings, and turning followers into paying customers — organically.
      </p>
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
      <Button label="Schedule a Free Call" />
    </section>
  );
};

export default HeroSection;
