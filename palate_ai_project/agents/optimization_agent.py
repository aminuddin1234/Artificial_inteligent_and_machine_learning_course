import pandas as pd

class OptimizationAgent:
    """Agent 6: Provides business insights for restaurants."""

    def __init__(self, menus_df: pd.DataFrame, restaurants_df: pd.DataFrame):
        self.menus = menus_df
        self.restaurants = restaurants_df

    def get_restaurant_insights(self, restaurant_id: str) -> Dict[str, Any]:
        """
        Generates insights for a specific restaurant.

        Args:
            restaurant_id: The ID of the restaurant.

        Returns:
            A dictionary with business insights.
        """
        restaurant_menus = self.menus[self.menus['restaurant_id'] == restaurant_id]
        
        if restaurant_menus.empty:
            return {'error': f'No menu data found for restaurant {restaurant_id}'}

        avg_price = restaurant_menus['price_myr'].mean()
        total_items = len(restaurant_menus)
        
        # Count items with specific allergens
        shellfish_items = restaurant_menus['allergens'].str.contains('shellfish', na=False).sum()
        gluten_items = restaurant_menus['allergens'].str.contains('gluten', na=False).sum()
        dairy_items = restaurant_menus['allergens'].str.contains('dairy', na=False).sum()
        # ... add others as needed

        # Most common cuisine type in the menu (if applicable)
        # Assuming cuisine type is consistent per restaurant, taken from restaurants.csv
        cuisine_type = self.restaurants[self.restaurants['restaurant_id'] == restaurant_id]['cuisine_type'].iloc[0]


        return {
            'restaurant_id': restaurant_id,
            'cuisine_type': cuisine_type,
            'average_menu_price': round(avg_price, 2),
            'total_menu_items': total_items,
            'items_with_shellfish': int(shellfish_items),
            'items_with_gluten': int(gluten_items),
            'items_with_dairy': int(dairy_items),
            'safety_diversity_score': round((total_items - max(shellfish_items, gluten_items, dairy_items)) / total_items, 2) if total_items > 0 else 0
        }
