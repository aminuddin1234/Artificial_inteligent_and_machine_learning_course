export interface Project {
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
  metrics?: {
    label: string;
    value: string;
  }[];
  github?: string;
  liveLink?: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Superstore Sales Analysis",
    description: "Comprehensive sales analytics dashboard identifying profit optimization opportunities across product categories and regions.",
    tools: ["Power BI", "Excel", "SQL"],
    domain: "Retail",
    situation: "A national retail chain was experiencing declining profit margins despite stable revenue growth.",
    task: "Analyze 5 years of transaction data to identify underperforming segments and root causes.",
    analysis: "Built interactive Power BI dashboards to visualize regional performance, category profitability, and customer segmentation. Used SQL for data cleaning and transformation.",
    result: "Identified $2.1M in potential savings by discontinuing 12% of low-margin products. Regional analysis revealed 3 underperforming states contributing to 40% of losses.",
    learning: "Revenue growth doesn't equal profit growth. Category-level granularity is essential for actionable insights.",
    metrics: [
      { label: "Cost Savings Identified", value: "$2.1M" },
      { label: "Products Optimized", value: "12%" },
      { label: "Dashboard Views", value: "500+" }
    ],
    github: "https://github.com",
    liveLink: "https://powerbi.com"
  },
  {
    id: 2,
    title: "Customer Churn Prediction",
    description: "Machine learning model predicting customer churn with 87% accuracy, enabling proactive retention strategies.",
    tools: ["Python", "Scikit-learn", "Pandas", "Tableau"],
    domain: "Telecommunications",
    situation: "A telecom provider was losing 15% of customers annually, costing approximately $5M in acquisition costs.",
    task: "Build a predictive model to identify at-risk customers and understand key churn drivers.",
    analysis: "Performed EDA on 50K customer records. Engineered 25+ features including usage patterns, billing history, and support interactions. Tested Random Forest, XGBoost, and Logistic Regression.",
    result: "Achieved 87% accuracy with XGBoost. Key drivers identified: contract type, data usage patterns, and support ticket frequency. Recommended retention interventions reduced churn by 23%.",
    learning: "Model interpretability matters in business contexts. Feature importance guided actionable retention strategies.",
    metrics: [
      { label: "Model Accuracy", value: "87%" },
      { label: "Churn Reduction", value: "23%" },
      { label: "Features Engineered", value: "25+" }
    ],
    github: "https://github.com"
  },
  {
    id: 3,
    title: "SQL Portfolio Project",
    description: "Advanced SQL queries demonstrating complex data manipulation, window functions, and query optimization.",
    tools: ["SQL", "PostgreSQL", "Excel"],
    domain: "E-commerce",
    situation: "E-commerce platform needed insights into customer behavior, product performance, and revenue trends.",
    task: "Design and execute complex SQL queries to extract actionable business insights from raw transaction data.",
    analysis: "Created 15+ complex queries using CTEs, window functions, joins, and subqueries. Optimized query performance reducing execution time by 60%.",
    result: "Discovered that top 10% of customers generate 70% of revenue. Identified seasonal trends and peak purchase times for targeted marketing.",
    learning: "Efficient queries unlock insights. Understanding business questions first leads to better SQL solutions.",
    metrics: [
      { label: "Queries Created", value: "15+" },
      { label: "Performance Gain", value: "60%" },
      { label: "Revenue from Top 10%", value: "70%" }
    ],
    github: "https://github.com"
  },
  {
    id: 4,
    title: "Household Income Analysis",
    description: "Statistical analysis of Malaysian household income distribution across states and percentiles from 2019-2024.",
    tools: ["Excel", "Python", "Tableau"],
    domain: "Finance",
    situation: "Government agency needed comprehensive income distribution data for policy planning and economic assessment.",
    task: "Clean, analyze, and visualize household income data across multiple years and geographic regions.",
    analysis: "Performed data cleaning on 100K+ records. Created statistical summaries and percentile distributions. Built interactive Tableau dashboards for public reporting.",
    result: "Revealed significant income inequality trends. Top 20% states showed 3x income growth vs bottom 20%. Findings informed 2 policy recommendations.",
    learning: "Data storytelling transforms numbers into actionable policy insights.",
    metrics: [
      { label: "Records Analyzed", value: "100K+" },
      { label: "States Covered", value: "16" },
      { label: "Policy Insights", value: "2" }
    ],
    liveLink: "https://tableau.com"
  },
  {
    id: 5,
    title: "Cafe Sales Dashboard",
    description: "Real-time sales monitoring dashboard with inventory tracking and sales forecasting capabilities.",
    tools: ["Excel", "Power BI", "Python"],
    domain: "Food & Beverage",
    situation: "Cafe chain needed real-time visibility into sales performance and inventory levels across 12 locations.",
    task: "Build automated dashboards integrating POS data with inventory management systems.",
    analysis: "Connected multiple data sources using Power Query. Created DAX measures for dynamic calculations. Built inventory alerts and sales forecasting models.",
    result: "Reduced stockouts by 45% through predictive inventory. Improved manager productivity by 5 hours/week through automated reporting.",
    learning: "Automation scales operations. Real-time data enables proactive decision-making.",
    metrics: [
      { label: "Stockout Reduction", value: "45%" },
      { label: "Time Saved/Week", value: "5 hrs" },
      { label: "Locations", value: "12" }
    ],
    liveLink: "https://powerbi.com"
  },
  {
    id: 6,
    title: "Project EDA Toolkit",
    description: "Custom Python package for automated exploratory data analysis, accelerating the initial data understanding phase.",
    tools: ["Python", "Pandas", "Seaborn", "Matplotlib"],
    domain: "Data Science",
    situation: "Data science team spent 40% of project time on initial EDA, slowing down model development.",
    task: "Create a reusable Python package automating common EDA tasks.",
    analysis: "Developed functions for automatic data profiling, missing value analysis, distribution visualization, and correlation detection. Included customizable report generation.",
    result: "Reduced EDA time by 70%. Package adopted by 8 team members. Open-sourced with 500+ downloads.",
    learning: "Reusable tools compound value. Solving own problems often solves others' problems too.",
    metrics: [
      { label: "Time Reduced", value: "70%" },
      { label: "Team Adoption", value: "8" },
      { label: "Downloads", value: "500+" }
    ],
    github: "https://github.com"
  }
];

export const filterOptions = {
  tools: ["All", "Python", "SQL", "Power BI", "Tableau", "Excel", "Scikit-learn"],
  domains: ["All", "Retail", "Telecommunications", "E-commerce", "Finance", "Food & Beverage", "Data Science"]
};
