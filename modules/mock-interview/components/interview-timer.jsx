"use client";

import { useEffect, useRef, useState } from "react";
import { Timer } from "lucide-react";
import { cn } from "@/lib/utils";

export default function InterviewTimer({ initialSeconds, onTimeout }) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const firedRef = useRef(false);
  const onTimeoutRef = useRef(onTimeout);

  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  useEffect(() => {
    setSeconds(initialSeconds);
    firedRef.current = false;
  }, [initialSeconds]);

  useEffect(() => {
    const fireOnce = () => {
      if (firedRef.current) return;
      firedRef.current = true;
      onTimeoutRef.current?.();
    };

    if (seconds <= 0) {
      fireOnce();
      return;
    }

    const id = setInterval(() => {
      setSeconds((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);

    return () => clearInterval(id);
  }, [seconds]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  const isCritical = seconds <= 300;
  const isWarning = seconds <= 600 && seconds > 300;

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-xl border font-mono text-lg font-bold tabular-nums transition-colors",
        isCritical &&
          "bg-red-50 dark:bg-red-950/50 border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 animate-pulse",
        isWarning &&
          "bg-yellow-50 dark:bg-yellow-950/50 border-yellow-300 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400",
        !isCritical &&
          !isWarning &&
          "bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-400",
      )}
    >
      <Timer className="w-5 h-5" />
      <span>
        {mm}:{ss}
      </span>
    </div>
  );
}
