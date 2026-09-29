import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

type FlowPath = { id: number; d: string; width: number };

function buildPaths(position: number): FlowPath[] {
  return Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.02,
  }));
}

/**
 * Flowing metallic paths — two mirrored families of animated curves weaving
 * across the hero stage. Deterministic per-load timing (no re-render
 * reshuffles), full-bleed coverage at any viewport, static under
 * prefers-reduced-motion. Theme-aware ink via `mode`.
 */
export function BackgroundPaths({
  mode = "dark",
  className = "",
}: {
  mode?: "dark" | "light";
  className?: string;
}) {
  const reduce = useReducedMotion();
  const paths = useMemo(() => [...buildPaths(1), ...buildPaths(-1)], []);
  const dark = mode === "dark";

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <svg
        className={`h-full w-full transition-colors duration-500 ${
          dark ? "text-white" : "text-[#17181A]"
        }`}
        viewBox="0 0 696 316"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        {paths.map((path, i) => (
          <motion.path
            key={`${i < 36 ? "a" : "b"}-${path.id}`}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.05 + path.id * (dark ? 0.012 : 0.016)}
            initial={
              reduce
                ? { pathLength: 1, opacity: 0.5 }
                : { pathLength: 0.3, opacity: 0.4 }
            }
            animate={
              reduce
                ? undefined
                : {
                    pathLength: 1,
                    opacity: [0.3, 0.6, 0.3],
                    pathOffset: [0, 1, 0],
                  }
            }
            transition={{
              // Deterministic per-path duration — 18–30s, stable across renders
              duration: 18 + ((i * 7) % 12),
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export default BackgroundPaths;
