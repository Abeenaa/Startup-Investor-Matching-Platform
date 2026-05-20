"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedMarqueeHeroProps {
  tagline: string;
  title: React.ReactNode;
  description: string;
  ctaText: string;
  images: string[];
  ctaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  className?: string;
}

const ActionButton = ({
  children,
  href = "#",
  variant = "primary",
}: {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary";
}) => (
  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors",
        variant === "primary"
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
          : "border border-border bg-white/70 text-foreground hover:bg-white"
      )}
    >
      {children}
    </Link>
  </motion.div>
);

export const AnimatedMarqueeHero: React.FC<AnimatedMarqueeHeroProps> = ({
  tagline,
  title,
  description,
  ctaText,
  images,
  ctaHref,
  secondaryCtaText,
  secondaryCtaHref,
  className,
}) => {
  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100, damping: 20 },
    },
  };

  const duplicatedImages = [...images, ...images];

  return (
    <section
      className={cn(
        "relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(40,195,190,0.18),_transparent_35%),linear-gradient(180deg,#f7fbfc_0%,#f2f6f7_100%)] px-4 text-center",
        className
      )}
    >
      <div className="absolute inset-0 innobiz-grid opacity-60" />
      <div className="absolute inset-x-0 top-24 mx-auto h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="z-10 flex max-w-4xl flex-col items-center">
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeIn}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/80 px-4 py-2 text-sm font-medium text-muted-foreground backdrop-blur-sm"
        >
          <Sparkles size={14} className="text-primary" />
          {tagline}
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="innobiz-title max-w-4xl text-5xl font-bold tracking-[-0.06em] text-foreground md:text-7xl"
        >
          {typeof title === "string" ? (
            title.split(" ").map((word, i) => (
              <motion.span key={i} variants={fadeIn} className="inline-block">
                {word}&nbsp;
              </motion.span>
            ))
          ) : (
            title
          )}
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="show"
          variants={fadeIn}
          transition={{ delay: 0.5 }}
          className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg"
        >
          {description}
        </motion.p>

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeIn}
          transition={{ delay: 0.6 }}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
        >
          <ActionButton href={ctaHref}>
            {ctaText}
            <ArrowRight size={16} />
          </ActionButton>
          {secondaryCtaText ? (
            <ActionButton href={secondaryCtaHref} variant="secondary">
              {secondaryCtaText}
            </ActionButton>
          ) : null}
        </motion.div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeIn}
          transition={{ delay: 0.75 }}
          className="mt-10 grid w-full max-w-3xl gap-4 sm:grid-cols-3"
        >
          {[
            ["500+", "ecosystem ventures profiled"],
            ["150+", "investors and program operators"],
            ["Nationwide", "reach across Ethiopia's innovation hubs"],
          ].map(([value, label]) => (
            <div key={label} className="rounded-3xl border border-white/70 bg-white/70 px-5 py-4 text-left shadow-sm backdrop-blur">
              <p className="innobiz-title text-2xl font-bold text-foreground">{value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 h-1/3 w-full [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] md:h-2/5">
        <motion.div
          className="flex gap-4"
          animate={{
            x: ["-100%", "0%"],
            transition: {
              ease: "linear",
              duration: 40,
              repeat: Infinity,
            },
          }}
        >
          {duplicatedImages.map((src, index) => (
            <div
              key={index}
              className="relative aspect-[3/4] h-48 flex-shrink-0 md:h-64"
              style={{
                rotate: `${index % 2 === 0 ? -2 : 5}deg`,
              }}
            >
              <img
                src={src}
                alt={`Showcase image ${index + 1}`}
                className="h-full w-full rounded-[1.75rem] border border-white/60 object-cover shadow-xl"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
