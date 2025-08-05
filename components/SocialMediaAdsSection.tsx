'use client'
import {
    Lightbulb,
    MonitorSmartphone,
    PencilLine,
    BarChart3,
  } from "lucide-react";
import Image from "next/image";
import {motion} from 'motion/react'  
  const services = [
    {
      icon: <Lightbulb size={24} />,
      title: "Instagram Ad Strategy",
      description:
        "We craft a custom Instagram ad strategy that aligns with your brand goals and audience behavior. From competitor insights to defining your visual language, we build a plan that makes your content stand out and convert.",
    },
    {
      icon: <MonitorSmartphone size={24} />,
      title: "Instagram Campaign Setup & Management",
      description:
        "We handle everything from ad account setup, audience targeting, and placement selection to daily optimization. Our focus is ensuring your Instagram ads reach the right people at the right moment.",
    },
    {
      icon: <PencilLine size={24} />,
      title: "Instagram Creative Development",
      description:
        "Our team designs scroll-stopping Instagram creatives — from story formats to reels and carousel posts. We blend strong visual storytelling with persuasive messaging to drive clicks, likes, and conversions.",
    },
    {
      icon: <BarChart3 size={24} />,
      title: "Instagram Ad Testing & Optimization",
      description:
        "We use data-driven A/B testing and advanced analytics to improve ad performance. From refining visuals to adjusting CTAs, we constantly optimize your Instagram campaigns to boost ROI.",
    },
  ];
  
  export default function InstagramAdsSection() {
    return (
      <section className="text-white px-6 md:px-16 py-16 scroll-mt-14" id="services">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center">
            Our <span className="text-secondry">Instagram Advertising</span> Services
          </h2>
          <p className="text-center text-gray-300 max-w-5xl mx-auto mt-4 text-base md:text-lg">
            We offer full-funnel Instagram ad services — from strategy and setup to testing and creative — tailored for SaaS brands and startups looking to scale fast and look good while doing it.
          </p>
          <Image
            src="/svg-highlighter.svg"
            alt="YourMedia Logo"
            className="text-center mx-auto my-4 md:w-[400px] w-[200px]"
            width={400}
            height={400}
          />
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 mt-12 max-w-[900px] mx-auto">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{y:82}}
                whileInView={{y: 0}}
                transition={{duration: 0.5}}
                viewport={{amount: 0.5}}
                className={`bg-neutral-900 sm:hover:rotate-3 ${index%2==0 ?'max-sm:rotate-3' : 'max-sm:-rotate-3'} duration-300 p-6 rounded-lg shadow-md hover:shadow-xl transition-all backdrop-blur-sm border border-white/10`}
              >
                <div className="mb-4 text-blue-400">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-300 text-md leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  