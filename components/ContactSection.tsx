'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useContactForm } from '@/hooks/useContactForm'
import Button from '@/components/Button'
import Image from 'next/image'

const ContactSection = () => {
  const { form, handleChange, handleSubmit, isLoading, success, error } = useContactForm()

  return (
    <section id="contact" className="scroll-mt-14 bg-gradient-to-b from-neutral-900 to-neutral-900 via-black rounded-2xl py-16 px-4 md:px-8 lg:px-24 border border-white/10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mx-auto text-center max-w-[900px]"
      >
        <h2 className="text-3xl md:text-8xl uppercase italic font-bold text-brand mb-4">
          Contact Us
        </h2>
        <p className="text-white text-lg">
          Let's talk about how we can help you grow your Instagram presence.
        </p>
        <Image
          src="/svg-highlighter.svg"
          alt="YourMedia Logo"
          className="text-center mx-auto mt-4 my-12 md:w-[400px] w-[200px]"
          width={400}
          height={400}
        />

        {success && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg"
          >
            <p className="text-green-400 font-medium">Message sent successfully! We'll get back to you soon.</p>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg"
          >
            <p className="text-red-400 font-medium">{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="w-full rounded-lg bg-zinc-800 px-4 py-3 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              className="w-full rounded-lg bg-zinc-800 px-4 py-3 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="Subject"
            required
            className="w-full rounded-lg bg-zinc-800 px-4 py-3 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Your Message"
            required
            rows={5}
            className="w-full rounded-lg bg-zinc-800 px-4 py-3 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary"
          ></textarea>

          <div className="flex justify-center">
            <button
              disabled={isLoading}
              className="bg-brand cursor-pointer hover:-translate-y-1 duration-300 text-lg font-bold text-black px-6 py-2 rounded-lg w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? 'Sending...' : success ? 'Sent!' : 'Send Message'}
            </button>
          </div>
        </form>
      </motion.div>
    </section>
  )
}

export default ContactSection
