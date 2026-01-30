import random
from datetime import datetime
import pandas as pd

class RealTimeAgent:
    """Agent 3: Simulates real-time data like wait times."""

    def __init__(self, restaurants_df: pd.DataFrame):
        self.restaurants = restaurants_df
        # Simulate peak hours (e.g., lunch 12-14, dinner 18-20)
        self.peak_hours = list(range(12, 15)) + list(range(18, 21))

    def get_wait_time(self, restaurant_id: str) -> Dict[str, Any]:
        """
        Estimates wait time for a restaurant based on its characteristics and current time.

        Args:
            restaurant_id: The ID of the restaurant.

        Returns:
            A dictionary with wait time estimates.
        """
        restaurant_row = self.restaurants[self.restaurants['restaurant_id'] == restaurant_id].iloc[0]
        current_hour = datetime.now().hour
        is_peak = current_hour in self.peak_hours

        # Heuristic: Higher rated, more expensive places might have longer waits, esp. during peak
        base_wait = 10 # Base wait time
        rating_factor = (restaurant_row['avg_rating'] - 3) * 5 # Adjust based on rating
        price_factor = 5 if restaurant_row['price_range'] == 'Premium' else (2 if restaurant_row['price_range'] == 'Medium' else 0)

        estimated_wait = base_wait + rating_factor + price_factor
        if is_peak:
             estimated_wait = int(estimated_wait * 2.0) # Double during peak

        # Add some randomness
        estimated_wait = max(5, random.randint(int(estimated_wait * 0.8), int(estimated_wait * 1.2)))

        return {
            'restaurant_id': restaurant_id,
            'estimated_wait_minutes': estimated_wait,
            'is_peak_time': is_peak,
            'data_source': 'simulation'
        }
