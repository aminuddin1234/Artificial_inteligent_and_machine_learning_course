import pandas as pd

class RecommendationAgent:
    """Agent 2: Generates initial recommendations based on user profile."""

    def __init__(self, menus_df: pd.DataFrame, restaurants_df: pd.DataFrame):
        self.menus = menus_df
        self.restaurants = restaurants_df

    def recommend(self, user_profile: pd.Series, top_n: int = 5) -> pd.DataFrame:
        """
        Recommends menu items based on user preferences and constraints.

        Args:
            user_profile: A row from user_profiles.csv.
            top_n: Number of recommendations desired.

        Returns:
            A pandas DataFrame of recommended menu items.
        """
        # Start with all menus
        candidates = self.menus.copy()

        # Filter by Halal if required
        if 'halal' in user_profile['dietary_restrictions'].lower():
            halal_restaurant_ids = self.restaurants[self.restaurants['halal_certified'] == 'Yes']['restaurant_id']
            candidates = candidates[candidates['restaurant_id'].isin(halal_restaurant_ids)]

        # Filter by budget
        budget_min, budget_max = map(int, user_profile['budget_range_myr'].split('-'))
        candidates = candidates[(candidates['price_myr'] >= budget_min) & (candidates['price_myr'] <= budget_max)]

        # Sort by price as a simple baseline (could be enhanced with more complex logic)
        sorted_candidates = candidates.sort_values(by='price_myr', ascending=True)

        # Return top N candidates
        return sorted_candidates[['menu_id', 'restaurant_id', 'dish_name', 'price_myr']].head(top_n)
