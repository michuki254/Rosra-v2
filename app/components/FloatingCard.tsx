'use client'

import { motion } from 'framer-motion'

export default function FloatingCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="relative"
    >
      {children}
    </motion.div>
  )
} 