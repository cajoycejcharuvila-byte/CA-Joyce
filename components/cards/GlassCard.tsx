"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverLift?: boolean;
}

export default function GlassCard({
  children,
  className = "",
  hoverLift = true,
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={hoverLift ? { y: -8 } : {}}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`bg-[rgba(255,255,255,0.65)] backdrop-blur-[20px] border border-[rgba(15,23,42,0.08)] rounded-[32px] shadow-soft ${className}`}
    >
      {children}
    </motion.div>
  );
}
