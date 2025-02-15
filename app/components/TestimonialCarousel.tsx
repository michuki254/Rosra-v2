'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function TestimonialCarousel({ testimonials }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  return (
    <div className="relative overflow-hidden h-[200px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-2xl">
            <p className="text-primary-light dark:text-primary-dark text-lg mb-4">
              {testimonials[current].quote}
            </p>
            <p className="text-text-light dark:text-text-dark">
              {testimonials[current].author}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
} 