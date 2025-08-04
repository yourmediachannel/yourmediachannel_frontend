import Image from "next/image";
import MobileMenu from "./MobileMenu";
import Button from "./Button";

const Navbar = () => {
  return (
    <>
      <nav className="fixed top-0 z-[1000] left-0 w-full bg-black text-white px-6 py-4 flex items-center justify-between shadow-md">
        {/* Logo + Brand */}
        <div className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="YourMedia Logo"
            width={40}
            height={40}
          />
          <span className="font-bold text-xl">YourMedia</span>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-6 text-sm font-medium">
          <li><a href="#services" className="hover:text-green-400 transition">Services</a></li>
          <li><a href="#case-studies" className="hover:text-green-400 transition">Case Studies</a></li>
          <li><a href="#about" className="hover:text-green-400 transition">About</a></li>
          <li><a href="#contact" className="hover:text-green-400 transition">Contact</a></li>
        </ul>

        {/* CTA Button */}
        <Button
          size="sm"
          href="#book"
          label="Book a Call"
        />

        {/* Hamburger + Mobile Menu inside */}
        <MobileMenu />
      </nav>
    </>
  );
};

export default Navbar;
