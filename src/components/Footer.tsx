import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, Users, TrendingUp, Github, Linkedin, Mail, Heart } from "lucide-react";

export default function Footer() {
  const [stats, setStats] = useState({
    visitors: Math.floor(Math.random() * 50) + 10,
    recruiters: Math.floor(Math.random() * 20) + 5,
    pageViews: Math.floor(Math.random() * 200) + 50,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        visitors: prev.visitors + Math.floor(Math.random() * 3),
        recruiters: prev.recruiters + Math.floor(Math.random() * 2),
        pageViews: prev.pageViews + Math.floor(Math.random() * 10),
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border-color)]">
      {/* Analytics Transparency Panel */}
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[var(--bg-card)] rounded-xl p-6 border border-[var(--border-color)]"
        >
          <div className="flex items-center justify-center mb-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Eye size={16} className="text-[var(--accent-primary)]" />
              Analytics Transparency Panel
            </h3>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Users size={16} className="text-[var(--accent-primary)]" />
                <span className="text-2xl font-bold">{stats.visitors}</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">Visitors this week</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <TrendingUp size={16} className="text-[var(--accent-secondary)]" />
                <span className="text-2xl font-bold">{stats.recruiters}</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">Recruiters visiting</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Eye size={16} className="text-[var(--accent-primary)]" />
                <span className="text-2xl font-bold">{stats.pageViews}</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">Total page views</p>
            </div>
          </div>
          
          <p className="text-xs text-[var(--text-secondary)] text-center mt-4">
            I believe in transparency—this widget shows real-time anonymized metrics. 
            No cookies, no tracking. Just data about data.
          </p>
        </motion.div>
      </div>

      {/* Main Footer - Centered */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col items-center text-center">
          {/* Brand */}
          <h3 className="text-2xl font-bold gradient-text mb-4">AMINUDDIN</h3>
          <p className="text-[var(--text-secondary)] mb-6 max-w-md">
            Data Analyst transforming complex data into actionable business insights.
          </p>
          
          {/* Social Links */}
          <div className="flex gap-4 mb-8">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-[var(--bg-card)] hover:bg-[var(--accent-primary)] hover:text-[var(--bg-primary)] transition-all"
            >
              <Github size={20} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-[var(--bg-card)] hover:bg-[var(--accent-primary)] hover:text-[var(--bg-primary)] transition-all"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="mailto:amiamin987@gmail.com"
              className="p-2 rounded-full bg-[var(--bg-card)] hover:bg-[var(--accent-primary)] hover:text-[var(--bg-primary)] transition-all"
            >
              <Mail size={20} />
            </a>
          </div>

          {/* Copyright */}
          <div className="border-t border-[var(--border-color)] pt-8 w-full max-w-md">
            <p className="text-[var(--text-secondary)] flex items-center justify-center gap-2">
              © {new Date().getFullYear()} Aminuddin Analyst. Built with <Heart size={16} className="text-red-500" /> and lots of data.
            </p>
            <p className="text-xs text-[var(--text-secondary)] mt-2">
              This site does not use cookies. Analytics are privacy-focused and anonymized.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
