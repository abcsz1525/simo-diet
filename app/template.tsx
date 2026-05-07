"use client";

import { motion } from "framer-motion";

/**
 * Page transition template для App Router.
 * Каждая страница оборачивается в motion-блок и плавно появляется.
 * `template.tsx` (vs `layout.tsx`) перерендеривается при каждой навигации,
 * что нужно для AnimatePresence-style эффекта в App Router.
 */
export default function PageTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.28,
        ease: [0.2, 0, 0, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
