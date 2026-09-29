import * as React from "react"
import { motion, type Variants } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedTextProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string
  duration?: number
  delay?: number
  replay?: boolean
  className?: string
  textClassName?: string
  underlineClassName?: string
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span"
  underlineGradient?: string
  underlineHeight?: string
  underlineOffset?: string
}

const AnimatedText = React.forwardRef<HTMLDivElement, AnimatedTextProps>(
  (
    {
      text,
      duration = 0.06,
      delay = 0.05,
      replay = true,
      className,
      textClassName,
      underlineClassName,
      as: Component = "h1",
      underlineGradient = "from-nxt-accent via-nxt-accent-bright to-nxt-accent",
      underlineHeight = "h-[2px]",
      underlineOffset = "-bottom-3",
      ...props
    },
    ref,
  ) => {
    const letters = Array.from(text)

    const container: Variants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: duration,
          delayChildren: delay,
        },
      },
    }

    const child: Variants = {
      hidden: { opacity: 0, y: 24 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          type: "spring",
          damping: 14,
          stiffness: 180,
        },
      },
    }

    const lineVariants: Variants = {
      hidden: { width: "0%", left: "50%" },
      visible: {
        width: "100%",
        left: "0%",
        transition: {
          delay: letters.length * duration + delay,
          duration: 0.7,
          ease: "easeOut",
        },
      },
    }

    const content = (
      <div className="relative">
        <motion.div
          style={{ display: "flex", overflow: "hidden" }}
          variants={container}
          initial="hidden"
          animate={replay ? "visible" : "hidden"}
          className={cn("text-center font-bold", textClassName)}
        >
          {letters.map((letter, index) => (
            <motion.span
              key={`${letter}-${index}`}
              variants={child}
              aria-hidden="true"
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          variants={lineVariants}
          initial="hidden"
          animate="visible"
          className={cn(
            "absolute bg-gradient-to-r",
            underlineHeight,
            underlineOffset,
            underlineGradient,
            underlineClassName,
          )}
        />
      </div>
    )

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center",
          className,
        )}
        {...props}
      >
        <Component>{content}</Component>
        <span className="sr-only">{text}</span>
      </div>
    )
  },
)

AnimatedText.displayName = "AnimatedText"

export { AnimatedText }
