import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ScrollProgress from "./components/ScrollProgress";
import StickyCTA from "./components/StickyCTA";

export default function App() {
  const [activeSection, setActiveSection] = useState("hero");

  const handleNavigate = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(section);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "projects", "skills", "about", "contact"];
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar activeSection={activeSection} onNavigate={handleNavigate} />
      <ScrollProgress activeSection={activeSection} />
      
      <main>
        <Hero onNavigate={handleNavigate} />
        <Projects />
        <Skills />
        <About />
        <Contact />
      </main>
      
      <Footer />
      <StickyCTA activeSection={activeSection} onNavigate={handleNavigate} />
    </div>
  );
}