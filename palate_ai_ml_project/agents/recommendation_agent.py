import pandas as pd
import numpy as np
from lightfm import LightFM
from lightfm.data import Dataset
from scipy.sparse import csr_matrix
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pickle
from typing import Dict, Any, List

class RecommendationAgent:
    """
    Agent 2: Personalized Recommendation Agent using LightFM (hybrid model).
    Combines collaborative filtering (user-item interactions) and content-based filtering (features).
    Note: Since we don't have explicit user-item interaction data (clicks/orders),
    we'll simulate implicit feedback based on user constraints matching menu items.
    A real system would use actual user behavior logs.
    """
    
    def __init__(self):
        self.model = LightFM(loss='warp', no_components=30, random_state=42) # WARP loss good for implicit feedback
        self.dataset = Dataset()
        self.trained = False
        self.restaurant_feature_matrix = None
        self.menu_feature_matrix = None
        self.user_features = None
        self.item_features = None
        self.user_mapping = {}
        self.item_mapping = {}

    def _prepare_interactions_and_features(self, user_profiles: pd.DataFrame, menus: pd.DataFrame, restaurants: pd.DataFrame):
        """
        Prepares user-item interactions and features for LightFM.
        Interaction strength is simulated based on how well user constraints match menu items.
        """
        # --- Prepare unique entities for LightFM dataset ---
        user_ids = user_profiles['user_id'].tolist()
        item_ids = menus['menu_id'].tolist()
        rest_ids = restaurants['restaurant_id'].tolist()

        # Fit the dataset
        self.dataset.fit(
            users=user_ids,
            items=item_ids,
            user_features=['dietary_halal', 'dietary_vegetarian', 'dietary_vegan', 'allergy_shellfish', 'allergy_gluten', 'allergy_dairy', 'allergy_peanut', 'condition_diabetes', 'condition_hypertension', 'condition_celiac'],
            item_features=['cuisine_healthy', 'cuisine_seafood', 'cuisine_vegetarian', 'cuisine_v', 'cuisine_western', 'cuisine_chinese', 'cuisine_malay', 'cuisine_indian', 'cuisine_japanese', 'cuisine_thai', 'allergen_shellfish', 'allergen_gluten', 'allergen_dairy', 'allergen_peanut', 'allergen_none', 'halal_yes', 'halal_no']
        )

        # --- Create user features ---
        user_features_raw = []
        for _, row in user_profiles.iterrows():
            feats = set()
            if 'halal' in row['dietary_restrictions']: feats.add('dietary_halal')
            if 'vegetarian' in row['dietary_restrictions']: feats.add('dietary_vegetarian')
            if 'vegan' in row['dietary_restrictions']: feats.add('dietary_vegan')
            if 'shellfish' in row['allergies']: feats.add('allergy_shellfish')
            if 'gluten' in row['allergies']: feats.add('allergy_gluten')
            if 'dairy' in row['allergies']: feats.add('allergy_dairy')
            if 'peanut' in row['allergies']: feats.add('allergy_peanut')
            if 'diabetes' in row['health_conditions']: feats.add('condition_diabetes')
            if 'hypertension' in row['health_conditions']: feats.add('condition_hypertension')
            if 'celiac_disease' in row['health_conditions']: feats.add('condition_celiac')
            user_features_raw.append(list(feats))

        # --- Create item features ---
        # First, merge menu with restaurant for halal info
        menus_with_rest = menus.merge(restaurants[['restaurant_id', 'halal_certified']], on='restaurant_id', how='left')
        item_features_raw = []
        for _, row in menus_with_rest.iterrows():
            feats = set()
            # Cuisine type
            cuisine_clean = row['cuisine_type'].lower().replace(' ', '_')
            feats.add(f'cuisine_{cuisine_clean}')
            # Allergens
            for allergen in row['allergens'].split('_'):
                if allergen != 'none': # Exclude 'none' as a feature
                    feats.add(f'allergen_{allergen}')
                else:
                    feats.add('allergen_none')
            # Halal status
            halal_status = row['halal_certified'].lower()
            feats.add(f'halal_{halal_status}')
            item_features_raw.append(list(feats))

        # Build interaction matrix (simulated implicit feedback)
        interactions_data = []
        for u_idx, (_, user_row) in enumerate(user_profiles.iterrows()):
            for i_idx, (_, menu_row) in enumerate(menus_with_rest.iterrows()):
                # Simulate interaction strength based on compatibility
                strength = 1.0 # Base strength
                # Reduce strength if dietary mismatch
                if 'halal' in user_row['dietary_restrictions'] and menu_row['halal_certified'] != 'Yes':
                    strength *= 0.1 # Low interest if not halal for halal user
                # Reduce strength if outside budget
                min_budget, max_budget = map(int, user_row['budget_range_myr'].split('-'))
                if not (min_budget <= menu_row['price_myr'] <= max_budget):
                    strength *= 0.1 # Low interest if outside budget
                # Reduce strength if allergen conflict
                user_alls = set(user_row['allergies'].split('_'))
                menu_alls = set(menu_row['allergens'].split('_'))
                if user_alls.intersection(menu_alls):
                    strength = 0.0 # No interaction if allergen conflict
                
                if strength > 0:
                    interactions_data.append((u_idx, i_idx, strength))

        if not interactions_data:
            raise ValueError("No valid interactions generated. Check user/menu compatibility logic.")

        user_ids_internal, item_ids_internal, weights = zip(*interactions_data)
        user_map, item_map = self.dataset.mapping()[0], self.dataset.mapping()[1]
        self.user_mapping = {uid: internal_id for uid, internal_id in user_map.items()}
        self.item_mapping = {iid: internal_id for iid, internal_id in item_map.items()}

        # Create CSR interaction matrix
        coo_interactions = np.array(interactions_data).T
        user_indices = coo_interactions[0]
        item_indices = coo_interactions[1]
        data = coo_interactions[2]
        num_users = len(user_map)
        num_items = len(item_map)
        interactions_matrix = csr_matrix((data, (user_indices, item_indices)), shape=(num_users, num_items))

        # Build feature matrices
        self.user_features = self.dataset.build_user_features([(uid, feats) for uid, feats in zip(user_ids, user_features_raw)])
        self.item_features = self.dataset.build_item_features([(iid, feats) for iid, feats in zip(item_ids, item_features_raw)])

        return interactions_matrix


    def train(self, user_profiles: pd.DataFrame, menus: pd.DataFrame, restaurants: pd.DataFrame):
        """
        Trains the LightFM model.
        """
        print("Preparing interactions and features for Recommendation Agent...")
        interactions = self._prepare_interactions_and_features(user_profiles, menus, restaurants)

        print("Training LightFM model...")
        self.model.fit(interactions, user_features=self.user_features, item_features=self.item_features, epochs=50, verbose=True)

        self.trained = True
        print("Recommendation Agent training completed.\n")


    def recommend(self, user_id: str, num_recommendations: int = 5) -> List[Dict[str, Any]]:
        """
        Generates recommendations for a user using the trained model.
        Filters results based on safety if a SafetyAgent is provided.
        """
        if not self.trained:
            raise ValueError("Recommendation Agent must be trained before making predictions.")

        if user_id not in self.user_mapping:
            raise KeyError(f"User ID {user_id} not found in training data.")

        user_internal_id = self.user_mapping[user_id]
        # Get scores for all items for this user
        scores = self.model.predict(user_internal_id, np.arange(len(self.item_mapping)), user_features=self.user_features, item_features=self.item_features)

        # Get top N item indices based on score
        top_item_internal_ids = np.argsort(-scores)[:num_recommendations]

        # Map back to original item IDs
        id_map_inv = {v: k for k, v in self.item_mapping.items()} # Invert item mapping
        recommended_menu_ids = [id_map_inv[iid] for iid in top_item_internal_ids]

        # Fetch details from original menus DataFrame
        # This is a simple lookup; in a real system, you'd want to join with restaurant data too.
        recommendations = []
        for mid in recommended_menu_ids:
             menu_row = menus[menus['menu_id'] == mid].iloc[0]
             recommendations.append({
                 'menu_id': menu_row['menu_id'],
                 'restaurant_id': menu_row['restaurant_id'],
                 'dish_name': menu_row['dish_name'],
                 'price_myr': menu_row['price_myr'],
                 'predicted_score': scores[self.item_mapping[mid]] # Include model score
             })

        return recommendations
