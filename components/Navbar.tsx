"use client"
import Image from "next/image";
import MobileMenu from "./MobileMenu";
import Button from "./Button";
import navItems from "@/constants/navItems";
import Link from "next/link";

const Navbar = () => {
  return (
    <>
      <nav className="fixed top-0 z-[1000] left-0 w-full  text-white px-6 md:px-20 py-4 flex items-center justify-between shadow-md bg-black/30 backdrop-blur-md">
        {/* Logo + Brand */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="YourMedia Logo"
            width={40}
            height={40}
          />
          <span className="font-bold text-xl">YourMedia</span>
        </Link>

      <div className="flex items-center gap-3 md:gap-6">
        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-6 text-sm font-medium">
          {
            navItems.map((item,index)=>(
              <li key={index}><a href={item.href} className="hover:text-green-400 transition">{item.label}</a></li>
            ))
          }
        </ul>

        {/* CTA Button */}
        <Button
          size="sm"
          href="http://topmate.io/YourAKShaw"
          label="Book a Call"
        />

        {/* Hamburger + Mobile Menu inside */}
        <MobileMenu />
      </div>
      </nav>
    </>
  );
};

export default Navbar;
