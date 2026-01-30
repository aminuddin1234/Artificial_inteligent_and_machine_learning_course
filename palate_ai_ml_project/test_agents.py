import pytest
import pandas as pd
from agents import SafetyAgent, RecommendationAgent, RealTimeAgent, OptimizationAgent

# --- Load Test Data ---
user_profiles = pd.read_csv('data/user_profiles.csv')
restaurants = pd.read_csv('data/restaurants.csv')
menus = pd.read_csv('data/menu.csv')

# --- Initialize Agents for Testing ---
safety_agent = SafetyAgent()
rec_agent = RecommendationAgent()
realtime_agent = RealTimeAgent()
opt_agent = OptimizationAgent()

def test_safety_agent_training():
    """Test that the safety agent can be trained."""
    safety_agent.train(user_profiles.sample(20), menus.sample(50), restaurants) # Use smaller sample for speed
    assert safety_agent.trained == True
    print("✅ Safety Agent training test passed.")

def test_recommendation_agent_training():
    """Test that the recommendation agent can be trained."""
    rec_agent.train(user_profiles.sample(20), menus.sample(50), restaurants)
    assert rec_agent.trained == True
    print("✅ Recommendation Agent training test passed.")

def test_realtime_agent_training():
    """Test that the realtime agent can be trained."""
    realtime_agent.train(restaurants)
    assert realtime_agent.trained == True
    print("✅ Real-Time Agent training test passed.")

def test_optimization_agent_training():
    """Test that the optimization agent can be trained."""
    opt_agent.train(menus.sample(50), restaurants) # Use smaller sample for speed
    assert opt_agent.trained == True
    print("✅ Optimization Agent training test passed.")

# --- Run Tests ---
if __name__ == "__main__":
    pytest.main([__file__, "-v"])
