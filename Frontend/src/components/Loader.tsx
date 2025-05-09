"use client";
import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation"; // For current path
import customVarients from "@/utils/initialVariants";

export default function Container({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname(); // Get current path

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname} // ✅ Key needed for AnimatePresence to work properly
        variants={customVarients}
        initial="hidden"
        animate="show"
        transition={{
          duration: 0.8,
          ease: "easeInOut",
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
