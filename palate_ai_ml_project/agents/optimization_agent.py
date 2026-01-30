import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score
from typing import Dict, Any
import matplotlib.pyplot as plt # Optional, for analysis

class OptimizationAgent:
    """
    Agent 6: Restaurant Optimization Agent using clustering (K-Means) and descriptive analytics.
    Provides insights based on aggregated menu and user interaction data (simulated here).
    """
    
    def __init__(self):
        self.clustering_model = KMeans(n_clusters=5, random_state=42) # 5 segments as per PDF
        self.scaler = StandardScaler()
        self.trained = False
        self.restaurant_clusters = None
        # Note: For true optimization, you'd need user interaction data (orders, clicks, ratings).
        # We'll use menu characteristics as a proxy here.


    def _prepare_clustering_data(self, menus: pd.DataFrame, restaurants: pd.DataFrame):
        """
        Prepares data for clustering restaurants based on their menu characteristics.
        """
        # Aggregate menu stats per restaurant
        agg_menus = menus.groupby('restaurant_id').agg(
            avg_price=('price_myr', 'mean'),
            std_price=('price_myr', 'std'),
            num_items=('menu_id', 'count'),
            num_shellfish_items=('allergens', lambda x: x.str.contains('shellfish').sum()),
            num_gluten_items=('allergens', lambda x: x.str.contains('gluten').sum()),
            num_dairy_items=('allergens', lambda x: x.str.contains('dairy').sum()),
            num_peanut_items=('allergens', lambda x: x.str.contains('peanut').sum()),
            pct_shellfish_items=('allergens', lambda x: x.str.contains('shellfish').mean()),
            pct_gluten_items=('allergens', lambda x: x.str.contains('gluten').mean()),
            pct_dairy_items=('allergens', lambda x: x.str.contains('dairy').mean()),
            pct_peanut_items=('allergens', lambda x: x.str.contains('peanut').mean()),
        ).reset_index()

        # Merge with restaurant data
        full_data = agg_menus.merge(restaurants[['restaurant_id', 'avg_rating', 'price_range', 'cuisine_type']], on='restaurant_id', how='left')

        # Encode categorical features for clustering
        cuisine_dummies = pd.get_dummies(full_data['cuisine_type'], prefix='cuisine')
        price_range_dummies = pd.get_dummies(full_data['price_range'], prefix='price_range')

        # Combine features
        feature_cols = ['avg_price', 'std_price', 'num_items', 'avg_rating'] + \
                       ['num_shellfish_items', 'num_gluten_items', 'num_dairy_items', 'num_peanut_items'] + \
                       ['pct_shellfish_items', 'pct_gluten_items', 'pct_dairy_items', 'pct_peanut_items']
        X = full_data[feature_cols]
        X = pd.concat([X, cuisine_dummies, price_range_dummies], axis=1)

        # Fill NaN values (e.g., std_price for restaurants with 1 item)
        X = X.fillna(0)

        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        return X_scaled, full_data


    def train(self, menus: pd.DataFrame, restaurants: pd.DataFrame):
        """
        Performs clustering on restaurants based on their characteristics.
        """
        print("Preparing data for Optimization Agent clustering...")
        X_scaled, self.restaurant_data_for_clustering = self._prepare_clustering_data(menus, restaurants)

        print("Performing K-Means clustering...")
        self.restaurant_clusters = self.clustering_model.fit_predict(X_scaled)
        self.restaurant_data_for_clustering['cluster'] = self.restaurant_clusters

        sil_score = silhouette_score(X_scaled, self.restaurant_clusters)
        print(f"Clustering completed. Number of clusters: {len(np.unique(self.restaurant_clusters))}")
        print(f"Silhouette Score: {sil_score:.3f}")

        self.trained = True
        print("Optimization Agent training completed.\n")


    def get_restaurant_insights(self, restaurant_id: str) -> Dict[str, Any]:
        """
        Provides insights for a specific restaurant based on clustering and aggregation.
        """
        if not self.trained:
             # Fallback to simple aggregation if not trained
             print("Warning: Optimization Agent not trained, providing simple aggregations.")
             rest_menus = menus[menus['restaurant_id'] == restaurant_id]
             insights = {
                 'restaurant_id': restaurant_id,
                 'total_menu_items': len(rest_menus),
                 'average_menu_price': rest_menus['price_myr'].mean() if not rest_menus.empty else 0,
                 'items_with_shellfish': rest_menus['allergens'].str.contains('shellfish').sum() if not rest_menus.empty else 0,
                 'items_with_gluten': rest_menus['allergens'].str.contains('gluten').sum() if not rest_menus.empty else 0,
                 'items_with_dairy': rest_menus['allergens'].str.contains('dairy').sum() if not rest_menus.empty else 0,
                 'cluster_assignment': 'Not Available (Model Not Trained)',
                 'cluster_description_approx': 'N/A'
             }
             return insights

        # Get data for the specific restaurant
        rest_row = self.restaurant_data_for_clustering[self.restaurant_data_for_clustering['restaurant_id'] == restaurant_id]

        if rest_row.empty:
            return {'error': f'Restaurant {restaurant_id} not found in clustering data.'}

        cluster_id = rest_row.iloc[0]['cluster']
        avg_price_cluster = self.restaurant_data_for_clustering[self.restaurant_data_for_clustering['cluster'] == cluster_id]['avg_price'].mean()

        # Describe clusters based on common patterns (this is a simplification)
        cluster_descriptions = {
            0: "Budget-Focused, Fast Service",
            1: "Mid-Range, Mixed Offerings",
            2: "Higher-Rated, Potentially Longer Waits",
            3: "Premium, Specialty Focus?",
            4: "Variable Characteristics"
        }
        desc = cluster_descriptions.get(cluster_id, f"Cluster {cluster_id}")

        return {
            'restaurant_id': restaurant_id,
            'cluster_assignment': int(cluster_id),
            'cluster_description_approx': desc,
            'average_price_in_cluster': avg_price_cluster,
            'total_menu_items': int(rest_row['num_items'].iloc[0]),
            'average_menu_price': float(rest_row['avg_price'].iloc[0]),
            'items_with_shellfish': int(rest_row['num_shellfish_items'].iloc[0]),
            'items_with_gluten': int(rest_row['num_gluten_items'].iloc[0]),
            'items_with_dairy': int(rest_row['num_dairy_items'].iloc[0]),
            'rating': float(rest_row['avg_rating'].iloc[0])
        }
