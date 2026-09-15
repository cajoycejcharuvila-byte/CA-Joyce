import { ReactNode } from "react";

interface FloatingCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function FloatingCard({
  children,
  className = "",
}: FloatingCardProps) {
  return (
    <div
      className={`bg-[rgba(255,255,255,0.75)] backdrop-blur-[20px] border border-[rgba(15,23,42,0.08)] rounded-[32px] shadow-glass transition-transform duration-300 hover:-translate-y-1 ${className}`}
    >
      {children}
    </div>
  );
}
