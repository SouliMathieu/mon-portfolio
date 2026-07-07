"use client";

import { useEffect, useState } from "react";
import { animate } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  duration?: number;
}

export default function AnimatedCounter({
  value,
  suffix = "",
  duration = 1.5,
}: AnimatedCounterProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [value, duration]);

  return (
    <span>
      {display}
      {suffix}
    </span>
  );
}