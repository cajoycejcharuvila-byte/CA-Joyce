"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface RevealTextProps {
  text: string;
  className?: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  delay?: number;
  duration?: number;
  blur?: boolean;
}

// Explicit Declarative Flags for Motion System
export const ssrSafe = true;
export const clientOnly = false;
export const reduceMotionSupported = true;

export default function RevealText({
  text,
  className = "",
  tag = "h2",
  delay = 0,
  duration = 0.8,
  blur = true,
}: RevealTextProps) {
  const Tag = tag;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <Tag className={`block overflow-visible ${className}`}>
        <span className="inline-block">{text}</span>
      </Tag>
    );
  }

  const variants = {
    hidden: {
      opacity: 0,
      y: 30,
      filter: blur ? "blur(10px)" : "blur(0px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: duration,
        delay: delay,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <Tag className={`block overflow-visible ${className}`}>
      <motion.span
        variants={variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="inline-block reveal-text-mobile-reset"
      >
        {text}
      </motion.span>
    </Tag>
  );
}
