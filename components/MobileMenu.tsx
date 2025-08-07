"use client";

import { useState, useEffect } from "react";
import Button from "./Button";
import navItems from "@/constants/navItems";

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect((): any => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  return (
    <>
      {/* 🍔 Hamburger */}
      <div onClick={() => setIsOpen(pre => !pre)} className="md:hidden z-[1000] relative flex items-center justify-center w-[30px] h-[30px] transform transition-all duration-200">
        <div
          className={`flex flex-col justify-between w-[20px] h-[20px] transform transition-all duration-300 ${isOpen && "rotate-[45deg]"
            } origin-center`}
        >
          <div
            className={`bg-white h-[2px] w-1/2 rounded transform transition-all duration-300  origin-right delay-75 ${isOpen && "-rotate-90 h-[1px] -translate-y-[1px]"
              }`}
          ></div>
          <div
            className={`bg-white h-[1px] rounded`}
          ></div>
          <div
            className={`bg-white h-[2px] w-1/2 rounded self-end transform transition-all duration-300 origin-left delay-75 ${isOpen && "-rotate-90 h-[1px] translate-y-[1px]"
              }`}
          ></div>
        </div>
      </div>

      {/* 📱 Mobile Overlay Menu */}

      <div className={`fixed top-0 min-h-screen md:hidden inset-0 bg-black text-white z-[100] duration-300 flex flex-col items-center justify-center gap-6 px-6 py-8 ${isOpen ? "translate-x-0" : "translate-x-[-100%]"}`}>
        {
          navItems.map((item, index) => (<div key={index}>
            {
              index !== navItems.length - 1 ? <a href={item.href} onClick={() => setIsOpen(false)} className="text-lg hovetext-brand">{item.label}</a> :
                <Button
                  href={item.href}
                  label={item.label}
                  onClick={() => setIsOpen(false)}
                  data-cal-namespace="30min"
                  data-cal-link="yourakshaw/30min"
                  data-cal-config='{"layout": "month_view"}'
                />
            }
          </div>
          ))
        }

      </div>
    </>
  );
};

export default MobileMenu;
