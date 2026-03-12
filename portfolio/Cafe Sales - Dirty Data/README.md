## Full Stack Data Project (Cafe Sales)


* Project overview ~
    - In this project demonstrates my ability to handle real-world, "dirty" data and transform it into a clean, actionable dataset for business insights.

* Key Insights ~
    1. Comprehensive Data Cleaning:
        - Identified and Resolved Data Anomalies: Conducted an initial audit of 10,000 records to identify "dirty" data points, including missing values (NaN) and erroneous placeholders like "ERROR" and "UNKNOWN".

        ![alt text](image-1.png)

    2. Data Type Standardization: 
        - Performed critical type conversions, transforming raw object strings into appropriate numerical (float), date (datetime), and categorical formats to enable mathematical analysis.

        From this 
        ![alt text](image-2.png)

        To this
        ![alt text](image-3.png)

    3. Rule-Based Imputation: 
        - Developed custom logic to reconstruct missing financial information. For instance,use existing `Total Spent` and `Price Per Unit` values to calculate missing `Quantity` data and so on so forth.

    4. Business Logic Mapping: 
        - Created mapping functions to cross-reference items with their fixed unit prices, ensuring data consistency across the entire dataset.

    5. Predictive Imputation (KNN): 
        - Instead of simply deleting rows with missing labels,implement a K-Nearest Neighbors (KNN) classifier is answers to predict and fill missing Item categories based on features like price, quantity, and location.


* Visualization
    - **1. Price vs Quantity Scatter (Bubble Chart):** Visualizes the relationship between unit price, quantity ordered, and total spent, with bubble size representing revenue.
    - **2. Revenue Distribution by Item (Pie Chart):** Shows the percentage contribution of each item to total revenue, helping identify top revenue generators.

   - **3. Transaction Count by Payment Method (Bar Chart):** Displays the popularity of different payment methods (Credit Card, Cash, Digital Wallet) among customers.

   - **4. Monthly Revenue Trend (Line Chart):** Tracks revenue performance over time, revealing seasonal patterns and growth trends throughout the year.

    - **5. Revenue Heatmap - Location vs Payment Method (Heatmap):** Cross-analysis visualization showing which payment methods perform best at each location (In-store, Takeaway, Online).


* Datasets ~
    - The datasets are sourced from the `KAGGLE` [Cafe Sales](https://www.kaggle.com/datasets/ahmedmohamed2003/cafe-sales-dirty-data-for-cleaning-training)
    
