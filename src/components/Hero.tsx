import { motion } from "framer-motion";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";

interface HeroProps {
  onNavigate: (section: string) => void;
}

const skills = ["Python", "SQL", "Power BI", "Tableau", "Machine Learning", "Data Visualization"];

export default function Hero({ onNavigate }: HeroProps) {
  return (
    <section id="hero" className="section relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Penang Blueprint Image - Blended Background */}
        <img 
          src="/penang_blueprint.png" 
          alt="Penang Blueprint"
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-lighten"
        />
        
        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)] via-transparent to-[var(--bg-primary)] opacity-70" />
        
        {/* Decorative blurs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--accent-primary)] rounded-full opacity-10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--accent-secondary)] rounded-full opacity-10 blur-3xl" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(42,42,58,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(42,42,58,0.3)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[var(--accent-primary)] font-medium mb-4">
              👋 Hello, I'm Aminuddin!
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            I turn messy data into{" "}
            <span className="gradient-text">hiring decisions</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-[var(--text-secondary)] mb-8 max-w-2xl"
          >
            Data Analyst with expertise in Python, SQL,Excel and BI tools. 
            I build interactive dashboards and predictive models that 
            drive measurable business outcomes.
          </motion.p>

          {/* Animated skill tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-3 mb-10"
          >
            {skills.map((skill, index) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="skill-tag"
              >
                {skill}
              </motion.span>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap gap-4"
          >
            <button
              onClick={() => onNavigate("projects")}
              className="btn-primary flex items-center gap-2"
            >
              View My Work 
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => onNavigate("contact")}
              className="btn-secondary flex items-center gap-2"
            >
              Get In Touch
            </button>
          </motion.div>

          
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-6 h-10 rounded-full border-2 border-[var(--text-secondary)] flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1 h-3 bg-[var(--accent-primary)] rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}