import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";

interface StickyCTAProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const ctaMessages: Record<string, string> = {
  hero: "View My Portfolio Project →",
  projects: "Check Out My Skills Radar →",
  skills: "Learn More About Me →",
  about: "Get In Touch Today →",
  contact: "View My Projects →",
};

export default function StickyCTA({ activeSection, onNavigate }: StickyCTAProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 300) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const getNextSection = () => {
    switch (activeSection) {
      case "hero":
        return "projects";
      case "projects":
        return "skills";
      case "skills":
        return "about";
      case "about":
        return "contact";
      case "contact":
        return "projects";
      default:
        return "projects";
    }
  };

  return (
    <AnimatePresence>
      {isVisible && activeSection !== "contact" && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass rounded-full px-6 py-3 flex items-center gap-4 shadow-lg shadow-[var(--accent-primary)]/20"
          >
            <button
              onClick={() => onNavigate(getNextSection())}
              className="flex items-center gap-2 text-sm font-medium whitespace-nowrap"
            >
              {ctaMessages[activeSection] || ctaMessages.hero}
              <ArrowRight size={16} className="text-[var(--accent-primary)]" />
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-[var(--bg-secondary)] rounded-full transition-colors"
            >
              <X size={16} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
