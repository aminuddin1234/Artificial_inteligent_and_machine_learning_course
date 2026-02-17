import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Github, Linkedin, Send, CheckCircle, Calendar } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedHiringType, setSelectedHiringType] = useState("");

  const hiringTypes = [
    { id: "full-time", label: "Full-time Data Analyst Role", projectSuggestion: "Check out my Superstore Sales Analysis and Customer Churn Prediction projects - they demonstrate end-to-end analytics workflow." },
    { id: "contract", label: "Contract/Project Work", projectSuggestion: "I would love to discuss your data challenges. My SQL Portfolio and EDA Toolkit show rapid insight generation capabilities." },
    { id: "consulting", label: "Consulting Engagement", projectSuggestion: "My interactive dashboards (Cafe Sales, Household Income) showcase visualization best practices I can bring to your team." },
    { id: "networking", label: "Just want to connect", projectSuggestion: "Always happy to discuss analytics trends, tools, or opportunities!" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleHiringTypeChange = (typeId: string) => {
    setSelectedHiringType(typeId);
    const selected = hiringTypes.find(h => h.id === typeId);
    if (selected) {
      setFormData({
        ...formData,
        subject: selected.label,
        message: `Hi Amin,\n\nI am interested in: ${selected.label}\n\n${selected.projectSuggestion}\n\nLooking forward to connecting!`
      });
    }
  };

  return (
    <section id="contact" className="section relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/penang_ocean.png" 
          alt="Penang Ocean"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)]/70 via-[var(--bg-primary)]/50 to-[var(--bg-primary)]/70" />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 w-full"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Let&apos;s <span className="gradient-text">Connect</span>
          </h2>
          <p className="text-[var(--text-secondary)] text-center w-full">
            Have a data challenge? Looking for a data analyst? Or just want to chat about analytics? I would love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="bg-[var(--bg-card)]/25 backdrop-blur-sm rounded-xl p-6 border border-[var(--border-color)]/50">
              <h3 className="text-xl font-bold mb-6">Get in Touch</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--accent-primary)]/20 flex items-center justify-center">
                    <Mail className="text-[var(--accent-primary)]" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-secondary)]">Email</p>
                    <p className="font-medium">amiamin987@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--accent-primary)]/20 flex items-center justify-center">
                    <Phone className="text-[var(--accent-primary)]" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-secondary)]">Phone</p>
                    <p className="font-medium">+60 199383471</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--accent-primary)]/20 flex items-center justify-center">
                    <MapPin className="text-[var(--accent-primary)]" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-secondary)]">Location</p>
                    <p className="font-medium">Malaysia (Open to Remote)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-[var(--bg-card)]/25 backdrop-blur-sm rounded-xl p-6 border border-[var(--border-color)]/50">
              <h3 className="text-xl font-bold mb-6">Follow Me</h3>
              <div className="flex gap-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 bg-[var(--bg-secondary)] rounded-lg hover:bg-[var(--accent-primary)] hover:text-[var(--bg-primary)] transition-all"
                >
                  <Github size={20} />
                  <span>GitHub</span>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 bg-[var(--bg-secondary)] rounded-lg hover:bg-[var(--accent-primary)] hover:text-[var(--bg-primary)] transition-all"
                >
                  <Linkedin size={20} />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>

            {/* Calendar Link */}
            <div className="bg-[var(--bg-card)]/25 backdrop-blur-sm rounded-xl p-6 border border-[var(--border-color)]/50">
              <h3 className="text-xl font-bold mb-2">Let&apos;s Schedule a Data Chat</h3>
              <p className="text-[var(--text-secondary)] mb-4">
                Quick 15-minute call to discuss your data needs.
              </p>
              <button className="btn-primary w-full flex items-center justify-center gap-2">
                <Calendar size={18} />
                Book a Time Slot
              </button>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[var(--bg-card)]/30 backdrop-blur-sm rounded-xl p-6 border border-[var(--border-color)]/50"
          >
            <h3 className="text-xl font-bold mb-6">Send a Message</h3>
            
            {/* Smart hiring type selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                I am reaching out because...
              </label>
              <select
                value={selectedHiringType}
                onChange={(e) => handleHiringTypeChange(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              >
                <option value="">Select an option...</option>
                {hiringTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
              {selectedHiringType && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-[var(--accent-primary)]"
                >
                  ✓ I have pre-filled relevant project suggestions for you
                </motion.p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                  placeholder="What is this about?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] resize-none"
                  placeholder="Tell me about your project or opportunity..."
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitted}
                className={`w-full py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                  isSubmitted
                    ? "bg-green-500 text-white"
                    : "gradient-bg text-white hover:opacity-90"
                }`}
              >
                {isSubmitted ? (
                  <>
                    <CheckCircle size={20} />
                    Message Sent!
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Send Message
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
