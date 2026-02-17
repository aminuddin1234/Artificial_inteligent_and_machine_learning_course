import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ExternalLink, ChevronDown, ChevronUp, BarChart3, Database, Code, Presentation, Lightbulb } from "lucide-react";
import { projects, filterOptions } from "../data/projects";

interface Project {
  id: number;
  title: string;
  description: string;
  tools: string[];
  domain: string;
  situation: string;
  task: string;
  analysis: string;
  result: string;
  learning: string;
  metrics?: { label: string; value: string }[];
  github?: string;
  liveLink?: string;
}

interface ProjectsProps {}

export default function Projects({}: ProjectsProps) {
  const [activeTool, setActiveTool] = useState("All");
  const [activeDomain, setActiveDomain] = useState("All");
  const [expandedProject, setExpandedProject] = useState<number | null>(null);

  const filteredProjects = projects.filter((project) => {
    const toolMatch = activeTool === "All" || project.tools.some(t => t.toLowerCase().includes(activeTool.toLowerCase()));
    const domainMatch = activeDomain === "All" || project.domain === activeDomain;
    return toolMatch && domainMatch;
  });

  return (
    <section id="projects" className="section relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/penang_midnight.png" 
          alt="Penang Midnight"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-secondary)]/50 via-[var(--bg-secondary)]/50 to-[var(--bg-secondary)]/80" />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-[var(--text-secondary)] text-center w-full">
            Interactive case studies demonstrating end-to-end analytical workflows. 
            Each project tells a story from raw data to actionable insights.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <div className="flex flex-wrap gap-3 justify-center">
            {filterOptions.tools.map((tool) => (
              <button
                key={tool}
                onClick={() => setActiveTool(tool)}
                className={`px-6 py-3 rounded-full text-base font-medium transition-all ${
                  activeTool === tool
                    ? "bg-[var(--accent-primary)] text-[var(--bg-primary)]"
                    : "bg-[var(--bg-card)]/55 backdrop-blur-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {tool}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {filterOptions.domains.map((domain) => (
            <button
              key={domain}
              onClick={() => setActiveDomain(domain)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeDomain === domain
                  ? "bg-[var(--accent-secondary)] text-white"
                  : "bg-[var(--bg-card)]/55 backdrop-blur-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {domain}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              isExpanded={expandedProject === project.id}
              onToggle={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
            />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[var(--text-secondary)]">No projects match the selected filters.</p>
          </div>
        )}
      </div>
    </section>
  );
}

interface ProjectCardProps {
  project: Project;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

function ProjectCard({ project, index, isExpanded, onToggle }: ProjectCardProps) {
  const getToolIcon = (tool: string) => {
    const toolLower = tool.toLowerCase();
    if (toolLower.includes("python") || toolLower.includes("pandas") || toolLower.includes("scikit")) return <Code size={14} />;
    if (toolLower.includes("sql")) return <Database size={14} />;
    if (toolLower.includes("power bi") || toolLower.includes("tableau")) return <Presentation size={14} />;
    return <BarChart3 size={14} />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-[var(--bg-card)]/55 backdrop-blur-sm rounded-xl overflow-hidden card-hover border border-[var(--border-color)]/50"
    >
      {/* Project Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-[var(--text-primary)]">{project.title}</h3>
          <span className="px-2 py-1 bg-[var(--bg-secondary)]/55 backdrop-blur-sm rounded text-xs text-[var(--accent-primary)]">
            {project.domain}
          </span>
        </div>

        <p className="text-[var(--text-secondary)] text-sm mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Tools */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tools.map((tool) => (
            <span
              key={tool}
              className="flex items-center gap-1 px-2 py-1 bg-[var(--bg-secondary)]/55 backdrop-blur-sm rounded text-xs text-[var(--text-secondary)]"
            >
              {getToolIcon(tool)}
              {tool}
            </span>
          ))}
        </div>

        {/* Metrics */}
        {project.metrics && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {project.metrics.map((metric, idx) => (
              <div key={idx} className="text-center p-2 bg-[var(--bg-secondary)]/55 backdrop-blur-sm rounded">
                <p className="text-lg font-bold text-[var(--accent-primary)]">{metric.value}</p>
                <p className="text-xs text-[var(--text-secondary)]">{metric.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Expand Button */}
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
        >
          {isExpanded ? (
            <>
              <ChevronUp size={16} />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown size={16} />
              View Details
            </>
          )}
        </button>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-[var(--border-color)]"
          >
            <div className="p-6 space-y-5">
              {/* STAR-L Method */}
              <div className="space-y-5">
                {/* Situation */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-[var(--accent-primary)] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[var(--accent-primary)] text-[var(--bg-primary)] flex items-center justify-center text-xs">
                      S
                    </span>
                    Situation
                  </h4>
                  <p className="text-sm text-[var(--text-secondary)] mt-1 pl-8">
                    {project.situation}
                  </p>
                </div>

                {/* Task */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-[var(--accent-primary)] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[var(--accent-primary)] text-[var(--bg-primary)] flex items-center justify-center text-xs">
                      T
                    </span>
                    Task
                  </h4>
                  <p className="text-sm text-[var(--text-secondary)] mt-1 pl-8">
                    {project.task}
                  </p>
                </div>

                {/* Analysis */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-[var(--accent-primary)] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[var(--accent-primary)] text-[var(--bg-primary)] flex items-center justify-center text-xs">
                      A
                    </span>
                    Analysis
                  </h4>
                  <p className="text-sm text-[var(--text-secondary)] mt-1 pl-8">
                    {project.analysis}
                  </p>
                </div>

                {/* Result */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-[var(--accent-primary)] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[var(--accent-primary)] text-[var(--bg-primary)] flex items-center justify-center text-xs">
                      R
                    </span>
                    Result
                  </h4>
                  <p className="text-sm text-[var(--text-secondary)] mt-1 pl-8">
                    {project.result}
                  </p>
                </div>

                {/* Learning */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-[var(--accent-secondary)] flex items-center gap-2">
                    <Lightbulb size={14} />
                    Learning
                  </h4>
                  <p className="text-sm text-[var(--text-secondary)] mt-1 pl-8">
                    {project.learning}
                  </p>
                </div>
              </div>

              {/* Action Links */}
              <div className="flex gap-3 pt-4 border-t border-[var(--border-color)]">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--bg-secondary)]/55 backdrop-blur-sm rounded-lg text-sm font-medium hover:bg-[var(--accent-primary)] hover:text-[var(--bg-primary)] transition-all"
                  >
                    <Github size={16} />
                    View Code
                  </a>
                )}
                {project.liveLink && (
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--accent-primary)] text-[var(--bg-primary)] rounded-lg text-sm font-medium hover:opacity-90 transition-all"
                  >
                    <ExternalLink size={16} />
                    View Dashboard
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}