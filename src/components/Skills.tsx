import { useState } from "react";
import { motion } from "framer-motion";
import { tools, skills } from "../data/skills";

interface Skill {
  name: string;
  level: number;
  projects: string[];
}

interface SkillsProps {}

export default function Skills({}: SkillsProps) {
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);

  return (
    <section id="skills" className="section relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/penang_neon_cyberpunk.png" 
          alt="Penang Neon"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)]/50 via-[var(--bg-primary)]/50 to-[var(--bg-primary)]/70" />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Skills & <span className="gradient-text">Expertise</span>
          </h2>
          <p className="text-[var(--text-secondary)] text-center w-full">
            Technical proficiency backed by real-world project experience.
            Hover over skills to see proof projects.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Radar Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-[var(--bg-card)]/35 backdrop-blur-sm rounded-2xl p-8 border border-[var(--border-color)]/50">
              <RadarChart skills={skills} hoveredSkill={hoveredSkill} />
            </div>
          </motion.div>

          {/* Skills List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => setHoveredSkill(skill)}
                onMouseLeave={() => setHoveredSkill(null)}
                className={`p-4 rounded-lg bg-[var(--bg-card)] border transition-all cursor-pointer ${
                  hoveredSkill?.name === skill.name
                    ? "border-[var(--accent-primary)] shadow-lg shadow-[var(--accent-primary)]/20"
                    : "border-[var(--border-color)]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{skill.name}</span>
                  <span className="text-[var(--accent-primary)] font-bold">{skill.level}%</span>
                </div>
                <div className="h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="h-full gradient-bg rounded-full"
                  />
                </div>
                {hoveredSkill?.name === skill.name && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-xs text-[var(--text-secondary)]"
                  >
                    <span className="text-[var(--accent-primary)]">Proof: </span>
                    {skill.projects.join(", ")}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Tools Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 pb-16"
        >
          <h3 className="text-2xl font-bold text-center mb-8">
            Tech <span className="gradient-text">Stack</span>
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {tools.map((tool, index) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-2 px-4 py-3 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] hover:border-[var(--accent-primary)] transition-all"
              >
                <span className="text-2xl">{tool.icon}</span>
                <span className="font-medium">{tool.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

interface RadarChartProps {
  skills: Skill[];
  hoveredSkill: Skill | null;
}

function RadarChart({ skills, hoveredSkill }: RadarChartProps) {
  const size = 400;
  const center = size / 2;
  const maxRadius = 150;
  const levels = 5;
  
  const angleStep = (2 * Math.PI) / skills.length;
  
  const getPoint = (index: number, radius: number) => {
    const angle = -Math.PI / 2 + index * angleStep;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };

  const getPolygonPoints = (level: number) => {
    return skills
      .map((_, i) => {
        const point = getPoint(i, (maxRadius * level) / levels);
        return `${point.x},${point.y}`;
      })
      .join(" ");
  };

  const getDataPoints = () => {
    return skills.map((skill, i) => {
      const radius = (skill.level / 100) * maxRadius;
      const point = getPoint(i, radius);
      const isHovered = hoveredSkill?.name === skill.name;
      return (
        <g key={skill.name}>
          <motion.circle
            cx={point.x}
            cy={point.y}
            r={isHovered ? 8 : 5}
            fill={isHovered ? "var(--accent-primary)" : "var(--accent-secondary)"}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.1 }}
          />
          {isHovered && (
            <text
              x={point.x}
              y={point.y - 15}
              textAnchor="middle"
              fill="var(--text-primary)"
              fontSize="12"
              fontWeight="bold"
            >
              {skill.level}%
            </text>
          )}
        </g>
      );
    });
  };

  const getDataPolygon = () => {
    const points = skills
      .map((skill, i) => {
        const radius = (skill.level / 100) * maxRadius;
        const point = getPoint(i, radius);
        return `${point.x},${point.y}`;
      })
      .join(" ");
    return points;
  };

  const axisLabels = skills.map((skill, i) => {
    const point = getPoint(i, maxRadius + 30);
    const isHovered = hoveredSkill?.name === skill.name;
    return (
      <text
        key={skill.name}
        x={point.x}
        y={point.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={isHovered ? "var(--accent-primary)" : "var(--text-secondary)"}
        fontSize="12"
        fontWeight={isHovered ? "bold" : "normal"}
        className="transition-colors"
      >
        {skill.name}
      </text>
    );
  });

  return (
    <svg width={size} height={size} className="mx-auto">
      {/* Background circles */}
      {Array.from({ length: levels }).map((_, i) => (
        <polygon
          key={i}
          points={getPolygonPoints(i + 1)}
          fill="none"
          stroke="var(--border-color)"
          strokeWidth="1"
          opacity={0.5}
        />
      ))}

      {/* Axis lines */}
      {skills.map((_, i) => {
        const point = getPoint(i, maxRadius);
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={point.x}
            y2={point.y}
            stroke="var(--border-color)"
            strokeWidth="1"
            opacity="0.5"
          />
        );
      })}

      {/* Data polygon */}
      <motion.polygon
        points={getDataPolygon()}
        fill="var(--accent-primary)"
        fillOpacity="0.2"
        stroke="var(--accent-primary)"
        strokeWidth="2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Data points */}
      {getDataPoints()}

      {/* Labels */}
      {axisLabels}
    </svg>
  );
}
