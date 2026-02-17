import { motion } from "framer-motion";
import {
  Award,
  Users,
  TrendingUp,
  Target,
  Calendar,
  Download,
} from "lucide-react";

export default function About() {
  return (
    <section id="about" className="section relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/penang_noir.png" 
          alt="Penang Noir"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-secondary)]/60 via-[var(--bg-secondary)]/50 to-[var(--bg-secondary)]/70" />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="gradient-text">Me</span>
          </h2>
        </motion.div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Profile Card - Centered on mobile, left side on desktop */}
          <div className="w-full lg:w-auto flex justify-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-[var(--accent-primary)] rounded-full opacity-20 blur-2xl" />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[var(--accent-secondary)] rounded-full opacity-20 blur-2xl" />

              {/* Profile card */}
              <div className="relative bg-[var(--bg-card)]/5 backdrop-blur-sm rounded-2xl p-8 border border-[var(--border-color)]/35 flex flex-col items-center">
                {/* Profile Circle */}
                <div className="w-48 h-48 mb-6 rounded-full overflow-hidden border-4 border-[var(--accent-primary)] p-1">
                  <div className="w-full h-full rounded-full bg-[var(--bg-secondary)] flex items-center justify-center">
                    <span className="text-6xl">👨‍💻</span>
                  </div>
                </div>

                {/* Text Content */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">
                    Muhammad Aminuddin
                  </h3>
                  <p className="text-[var(--accent-primary)] font-medium mb-4">
                    Data Analyst
                  </p>
                  <p className="text-[var(--text-secondary)] text-sm mb-6 max-w-[250px] mx-auto">
                    Transforming complex data into actionable business insights
                  </p>
                </div>

                {/* Resume Download Button - Centered */}
                <button className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl">
                  <Download size={18} />
                  Download Resume
                </button>
              </div>
          </motion.div>
          </div>

          {/* Bio & Philosophy */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 space-y-6"
          >
            <div className="bg-[var(--bg-card)]/15 backdrop-blur-sm rounded-xl p-6 border border-[var(--border-color)]/50">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Target className="text-[var(--accent-primary)]" />
                My Analytical Philosophy
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                "
                <span className="text-[var(--text-primary)] font-medium">
                  I believe clean data &gt; complex models.
                </span>
                " In a world obsessed with sophisticated algorithms, I focus on
                the fundamentals: understanding the data, the business question,
                and delivering actionable insights that stakeholders can
                actually use.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Every analysis starts with a question, not a tool. Whether it is
                predicting churn, optimizing inventory, or identifying revenue
                opportunities, I approach each problem with curiosity and rigor.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Award, label: "Projects Completed", value: "10+" },
                { icon: Users, label: "Happy Stakeholders", value: "50+" },
                { icon: TrendingUp, label: "Business Impact", value: "$2M+" },
                { icon: Calendar, label: "Years Experience", value: "3+" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[var(--bg-card)]/15 backdrop-blur-sm rounded-xl p-4 border border-[var(--border-color)]/50"
                >
                  <stat.icon
                    className="text-[var(--accent-primary)] mb-2"
                    size={24}
                  />
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* What I bring */}
            <div className="bg-[var(--bg-card)]/15 backdrop-blur-sm rounded-xl p-6 border border-[var(--border-color)]/50">
              <h4 className="font-semibold mb-3">What I Bring to Your Team:</h4>
              <ul className="space-y-2 text-[var(--text-secondary)]">
                <li className="flex items-start gap-2">
                  <span className="text-[var(--accent-primary)]">▸</span>
                  Strong SQL and Python for data manipulation and analysis
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--accent-primary)]">▸</span>
                  Interactive dashboard development (Power BI, Tableau)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--accent-primary)]">▸</span>
                  Machine learning for predictive analytics
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--accent-primary)]">▸</span>
                  Business acumen to translate data into decisions
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
