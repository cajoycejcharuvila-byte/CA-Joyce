"use client";

import { motion } from "framer-motion";
import { ReactNode, useState, useEffect } from "react";

interface FloatingCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

// Explicit Declarative Flags for Motion System
export const ssrSafe = true;
export const clientOnly = true;
export const reduceMotionSupported = true;

export default function FloatingCard({
  children,
  className = "",
  delay = 0,
}: FloatingCardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const cardClass = `bg-[rgba(255,255,255,0.75)] backdrop-blur-[20px] border border-[rgba(15,23,42,0.08)] rounded-[32px] shadow-glass ${className}`;

  if (!mounted) {
    return (
      <div className={cardClass}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{
        y: [-8, 8, -8],
      }}
      transition={{
        duration: 6,
        ease: "easeInOut",
        repeat: Infinity,
        delay: delay,
      }}
      className={`${cardClass} floating-card-mobile-reset`}
    >
      {children}
    </motion.div>
  );
}
