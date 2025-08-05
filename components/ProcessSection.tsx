'use client'
import Image from 'next/image'
import React from 'react'
import {motion} from 'motion/react'

const processSteps = [
  "We begin by understanding your business goals, target audience, and current Instagram presence. Then we run a detailed competitor analysis to uncover gaps and winning strategies specific to your niche.",
  
  "Based on our research, we build a tailored Instagram growth plan—from organic content to paid promotions. We handle everything from targeting setup to choosing the right ad formats and content types that attract your ideal followers.",
  
  "Once live, we actively monitor your campaign performance, running A/B tests, adjusting targeting, and improving creative. You’ll receive regular updates with metrics like reach, engagement, follower growth, and ROI."
];


const ProcessSection = () => {
  
  return (
         <section className="text-white px-6 md:px-16 py-16 scroll-mt-14" id="process">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center">
                Our <span className="text-secondry">Instagram Advertising</span> Process
              </h2>
              <p className="text-center text-gray-300 max-w-5xl mx-auto mt-4 text-base md:text-lg">
              Our proven process for high-performing paid instraram management projects follows a simple three-step process, with the constant goal of getting you more qualified leads at a predictable and scalable rate.
              </p>
              <Image
                src="/svg-highlighter.svg"
                alt="YourMedia Logo"
                className="text-center mx-auto my-4 md:w-[400px] w-[200px]"
                width={400}
                height={400}
              />
      
              <div className="flex flex-col gap-8 sm:gap-10 mt-12 max-w-[900px] mx-auto">
                {processSteps.map((steps, index) => (
                  <motion.div
                    initial={{scale: 1}}
                    whileInView={{scale: 1.2, rotate: 0}}
                    key={index}
                    viewport={{amount: 0.5}}
                    className={`max-w-[400px] sm:hover:rotate-3 ${index%2==0 ?'self-end bg-white text-neutral-900 rotate-3' : 'bg-neutral-900 max-sm:-rotate-3 text-white'} duration-300 p-6 rounded-lg shadow-md hover:shadow-xl transition-all backdrop-blur-sm border border-white/10`}
                  >
                    <div className={`flex gap-6 md:gap-10 items-center ${index%2==0 ?'flex-row' : 'flex-row-reverse'}`}>
                      <h2 className='text-6xl md:text-8xl italic'>{index+1}</h2> 
                    <p className="text-md md:text-xl">
                      {steps}
                    </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
  )
}

export default ProcessSection