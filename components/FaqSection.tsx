'use client';
import { faqs } from '@/constants/homepage';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';

const FaqSection = () => {
  return (
    <section className="text-white px-6 md:px-16 py-16 scroll-mt-14" id="faq">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center">
          Instagram <span className="text-secondry">Lead Gen</span> FAQs
        </h2>
        <p className="text-center text-gray-300 max-w-5xl mx-auto mt-4 text-base md:text-lg">
          Everything you need to know before getting started. Still have Qs? DM us or book a free call.
        </p>

        <div className="flex flex-col gap-8 sm:gap-10 mt-12 max-w-[900px] mx-auto">
          <Accordion/>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;


export const Accordion = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index))
  }

  return (
    <div className="w-full mx-auto space-y-4">
      {faqs.map((faq, index) => (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ amount: 0.5 }}
          transition={{ duration: 0.5 , delay: index * 0.1}}
          key={index}
          className="border border-gray-700 rounded-xl overflow-hidden bg-zinc-900"
        >
          <button
            className="w-full text-left px-6 py-4 font-semibold text-white flex justify-between items-center"
            onClick={() => toggle(index)}
          >
            <span>{faq.question}</span>
            <div className="text-gray-400 relative w-12">
              <div className="w-4 h-[2px] bg-gray-400 absolute top-0 right-0 rounded"/>
              <div className={` ${openIndex === index ? 'rotate-0' : 'rotate-90'} w-4 h-[2px] bg-gray-400 absolute top-0 right-0 duration-300 rounded`}/>
            </div>
          </button>

          <AnimatePresence initial={false}>
            {openIndex === index && (
              <motion.div
                key="content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 124, opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden px-6 pb-4 text-gray-300"
              >
                <div>{faq.answer}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
}
