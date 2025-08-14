'use client'

import React from 'react'
import { easeInOut, motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react'
import { ChevronUp } from 'lucide-react'
const ScrollToTopButton = () => {
  const { scrollYProgress } = useScroll({ offset: ['start start', 'end end'] })
  useMotionValueEvent(scrollYProgress, "change", (latest) => console.log(latest))
  const opacity = useTransform(scrollYProgress, [0, 0.02], [0, 1]);
  const pathLength = useTransform(scrollYProgress, [0.02, 1], [0, 1])
  return (
    <motion.a href='#hero'
      initial={{ opacity: 0 }}
      style={{ opacity }}
      transition={{ ease: easeInOut, duration: 0.4 }}
      className='fixed bottom-10 right-10 z-10 bg-white/40 backdrop-blur-md rounded-full'>
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width="50"
        height="50"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Circle as a path so we can animate pathLength */}
        <motion.circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke="#36ff5b"
          pathLength={1}
          initial={{ pathLength: 0 }}
          style={{ pathLength }}
          transition={{ ease: "easeInOut" }}
        />

        {/* Up chevron */}
        <path d="m8 14 4-4 4 4" />
      </motion.svg>

    </motion.a>
  )
}

export default ScrollToTopButton
