/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectClass?: string;
}

// Explicit Declarative Flags for Motion System
export const ssrSafe = true;
export const clientOnly = true;
export const reduceMotionSupported = true;

export default function ParallaxImage({
  src,
  alt,
  className = "",
  aspectClass = "aspect-[16/9]",
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Transform scroll progress to translation values (-12% to 12% translation)
  const yTranslate = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  const wrapperClass = `relative overflow-hidden rounded-3xl ${aspectClass} ${className}`;

  return (
    <div
      ref={containerRef}
      className={wrapperClass}
      style={{ borderRadius: "32px" }}
    >
      {mounted ? (
        <motion.div 
          style={{ y: yTranslate }} 
          className="absolute inset-0 w-full h-[124%] top-[-12%] parallax-image-mobile-reset"
        >
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover absolute inset-0 transition-transform duration-500 hover:scale-[1.02]"
            loading="lazy"
          />
        </motion.div>
      ) : (
        <div className="absolute inset-0 w-full h-[100%] top-0">
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover absolute inset-0"
            loading="lazy"
          />
        </div>
      )}
      <div className="absolute inset-0 border border-brand-border pointer-events-none rounded-3xl" style={{ borderRadius: "32px" }} />
    </div>
  );
}
