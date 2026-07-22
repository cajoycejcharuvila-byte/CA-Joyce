"use client";

import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  duration?: number; // in seconds
  suffix?: string;
  className?: string;
}

export default function AnimatedCounter({
  value,
  duration = 1.5,
  suffix = "",
  className = "",
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    if (start === end) {
      setTimeout(() => {
        setCount(end);
      }, 0);
      return;
    }

    const totalMiliseconds = duration * 1000;
    const stepTime = Math.max(Math.floor(totalMiliseconds / end), 20);
    
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, duration, isInView]);

  return (
    <span ref={ref} className={`font-mono ${className}`}>
      {count}
      {suffix}
    </span>
  );
}
