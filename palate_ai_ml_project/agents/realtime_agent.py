import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from datetime import datetime, timedelta
import random
from typing import Dict, Any

class RealTimeAgent:
    """
    Agent 3: Real-Time Data Processing Agent using regression models to predict wait times.
    This agent simulates live data and trains a model on features like time, restaurant attributes.
    """
    
    def __init__(self):
        # Using Gradient Boosting Regressor as suggested in PDF for wait time prediction
        self.model = GradientBoostingRegressor(n_estimators=100, max_depth=5, random_state=42)
        # self.model = LinearRegression() # Alternative simpler model
        self.trained = False
        self.restaurant_avg_rating = {}
        self.restaurant_price_range = {}

    def _simulate_wait_data(self, restaurants: pd.DataFrame, num_samples_per_restaurant=50):
        """
        Simulates historical wait time data based on restaurant characteristics and time.
        In a real system, this data comes from live tracking APIs.
        """
        data = []
        for _, rest_row in restaurants.iterrows():
            rest_id = rest_row['restaurant_id']
            avg_rating = rest_row['avg_rating']
            price_range = rest_row['price_range']
            # Store for feature creation later
            self.restaurant_avg_rating[rest_id] = avg_rating
            self.restaurant_price_range[rest_id] = price_range

            for _ in range(num_samples_per_restaurant):
                # Simulate a random time of day
                hour = random.randint(0, 23)
                minute = random.randint(0, 59)
                day_of_week = random.randint(0, 6) # Mon=0, Sun=6

                # Base wait time influenced by rating and price (higher rated/premium might have longer waits)
                base_wait = 10 # Base
                base_wait += (avg_rating - 3) * 3 # Higher rating adds wait
                if price_range == 'Premium': base_wait += 15
                elif price_range == 'Medium': base_wait += 5

                # Peak hour effect
                is_lunch = 11 <= hour <= 14
                is_dinner = 17 <= hour <= 21
                if is_lunch or is_dinner:
                    base_wait *= 1.8

                # Weekend effect
                is_weekend = day_of_week >= 5
                if is_weekend:
                    base_wait *= 1.3

                # Add some noise
                simulated_wait = max(5, base_wait + random.gauss(0, 5)) # Min 5 mins, Gaussian noise

                data.append({
                    'restaurant_id': rest_id,
                    'hour': hour,
                    'minute': minute,
                    'day_of_week': day_of_week,
                    'is_lunch': int(is_lunch),
                    'is_dinner': int(is_dinner),
                    'is_weekend': int(is_weekend),
                    'avg_rating': avg_rating,
                    'is_premium': 1 if price_range == 'Premium' else 0,
                    'is_medium': 1 if price_range == 'Medium' else 0,
                    'simulated_actual_wait': simulated_wait
                })

        return pd.DataFrame(data)


    def train(self, restaurants: pd.DataFrame):
        """
        Trains the wait time prediction model using simulated historical data.
        """
        print("Simulating historical wait time data for Real-Time Agent...")
        wait_data = self._simulate_wait_data(restaurants)

        X = wait_data[['hour', 'minute', 'day_of_week', 'is_lunch', 'is_dinner', 'is_weekend', 'avg_rating', 'is_premium', 'is_medium']]
        y = wait_data['simulated_actual_wait']

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        print("Training Gradient Boosting Regressor for wait times...")
        self.model.fit(X_train, y_train)

        # Evaluate on test set
        y_pred = self.model.predict(X_test)
        mae = mean_absolute_error(y_test, y_pred)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        r2 = r2_score(y_test, y_pred)

        print("\n--- Real-Time Agent Model Evaluation ---")
        print(f"Mean Absolute Error (MAE): {mae:.2f} minutes")
        print(f"Root Mean Squared Error (RMSE): {rmse:.2f} minutes")
        print(f"R^2 Score: {r2:.2f}")
        print("Real-Time Agent training completed.\n")

        self.trained = True


    def get_wait_time(self, restaurant_id: str, current_datetime: datetime = None) -> Dict[str, Any]:
        """
        Predicts wait time for a restaurant at a given time using the trained model.
        """
        if not self.trained:
            # Fallback simulation if not trained
            print("Warning: Real-Time Agent not trained, using simulation fallback.")
            base = 10 + (self.restaurant_avg_rating.get(restaurant_id, 4) - 3) * 3
            if self.restaurant_price_range.get(restaurant_id, 'Budget') == 'Premium': base += 15
            if current_datetime is None: current_datetime = datetime.now()
            if 11 <= current_datetime.hour <= 14 or 17 <= current_datetime.hour <= 21: base *= 1.8
            return {'restaurant_id': restaurant_id, 'estimated_wait_minutes': int(base), 'data_source': 'simulation_fallback'}

        if current_datetime is None:
            current_datetime = datetime.now()

        # Prepare features for prediction
        X_pred = pd.DataFrame([{
            'hour': current_datetime.hour,
            'minute': current_datetime.minute,
            'day_of_week': current_datetime.weekday(),
            'is_lunch': 1 if 11 <= current_datetime.hour <= 14 else 0,
            'is_dinner': 1 if 17 <= current_datetime.hour <= 21 else 0,
            'is_weekend': 1 if current_datetime.weekday() >= 5 else 0,
            'avg_rating': self.restaurant_avg_rating.get(restaurant_id, 4.0), # Default rating
            'is_premium': 1 if self.restaurant_price_range.get(restaurant_id, 'Budget') == 'Premium' else 0,
            'is_medium': 1 if self.restaurant_price_range.get(restaurant_id, 'Budget') == 'Medium' else 0,
        }])

        # Predict
        predicted_wait = self.model.predict(X_pred)[0]
        predicted_wait = max(5, predicted_wait) # Ensure minimum wait time

        return {
            'restaurant_id': restaurant_id,
            'estimated_wait_minutes': int(predicted_wait),
            'prediction_timestamp': current_datetime.isoformat(),
            'data_source': 'ml_model_prediction'
        }
