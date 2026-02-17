import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ScrollProgressProps {
  activeSection: string;
}

const sections = [
  { id: "hero", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export default function ScrollProgress({ activeSection }: ScrollProgressProps) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Progress bar at top */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 gradient-bg z-[60]"
        style={{ scaleX: scrollProgress / 100, transformOrigin: "0%" }}
      />

      {/* Dot navigation */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3"
      >
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="group relative flex items-center"
          >
            <motion.div
              className={`w-3 h-3 rounded-full transition-all ${
                activeSection === section.id
                  ? "bg-[var(--accent-primary)] scale-125"
                  : "bg-[var(--border-color)] group-hover:bg-[var(--text-secondary)]"
              }`}
            />
            
            {/* Tooltip */}
            <AnimatePresence>
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                whileHover={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="absolute right-full mr-3 px-2 py-1 bg-[var(--bg-card)] rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {section.label}
              </motion.span>
            </AnimatePresence>
          </a>
        ))}
      </motion.div>
    </>
  );
}
