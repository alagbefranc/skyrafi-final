"use client"

import * as React from "react"
import { motion, useTransform, useScroll, useSpring } from "framer-motion"

interface HorizontalScrollCarouselProps {
  children: React.ReactNode[]
}

const HorizontalScrollCarousel: React.FC<HorizontalScrollCarouselProps> = ({ children }) => {
  const targetRef = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
  })

  // Create a spring animation for smoother movement
  const springConfig = { stiffness: 300, damping: 30, bounce: 0 }
  const smoothProgress = useSpring(scrollYProgress, springConfig)
  
  // Calculate the scroll range - we need to move the content left by its width minus viewport width
  // With 12 cards at 400px each + gaps, that's about 5000px total
  const x = useTransform(smoothProgress, [0, 1], ["0px", "-3500px"])

  return (
    <section
      ref={targetRef}
      className="relative h-[300vh]"
    >
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden bg-gray-50">
        {/* Progress Bar */}
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-sky-blue-500 rounded-full"
            style={{ scaleX: smoothProgress }}
            initial={{ scaleX: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
        
        {/* Carousel Content */}
        <motion.div
          style={{ x }}
          className="flex gap-6 pl-[10vw]"
        >
          {children}
        </motion.div>
        
        {/* Scroll Hint */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-gray-500 text-sm"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ↓ Keep scrolling to see more features
        </motion.div>
      </div>
    </section>
  )
}

export { HorizontalScrollCarousel };
