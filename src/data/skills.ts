export interface Skill {
  name: string;
  level: number;
  projects: string[];
}

export const skills: Skill[] = [
  { name: "Python", level: 90, projects: ["Customer Churn Prediction", "Project EDA Toolkit"] },
  { name: "SQL", level: 85, projects: ["SQL Portfolio Project", "Superstore Sales Analysis"] },
  { name: "Power BI", level: 88, projects: ["Superstore Sales Analysis", "Cafe Sales Dashboard"] },
  { name: "Tableau", level: 80, projects: ["Customer Churn Prediction", "Household Income Analysis"] },
  { name: "Excel", level: 95, projects: ["Superstore Sales Analysis", "Household Income Analysis", "Cafe Sales Dashboard"] },
  { name: "Machine Learning", level: 75, projects: ["Customer Churn Prediction", "Project EDA Toolkit"] },
  { name: "Data Visualization", level: 90, projects: ["Superstore Sales Analysis", "Household Income Analysis", "Customer Churn Prediction"] },
  { name: "Statistics", level: 80, projects: ["Customer Churn Prediction", "Household Income Analysis"] }
];

export const tools = [
  { name: "Python", icon: "🐍", color: "#3776AB" },
  { name: "SQL", icon: "🗄️", color: "#4479A1" },
  { name: "Power BI", icon: "📊", color: "#F2C811" },
  { name: "Tableau", icon: "📈", color: "#E97627" },
  { name: "Excel", icon: "📋", color: "#217346" },
  { name: "Pandas", icon: "🐼", color: "#150458" },
  { name: "Scikit-learn", icon: "🔬", color: "#F89939" },
  { name: "Git", icon: "📦", color: "#F05032" }
];
