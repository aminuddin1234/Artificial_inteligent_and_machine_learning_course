import pytest
import pandas as pd
from agents import SafetyAgent, RecommendationAgent, RealTimeAgent, ReviewAnalysisAgent, MenuOCRAgent, OptimizationAgent

# --- Load Test Data ---
user_profiles = pd.read_csv('data/user_profiles.csv')
restaurants = pd.read_csv('data/restaurants.csv')
menus = pd.read_csv('data/menu.csv')

# --- Initialize Agents for Testing ---
safety_agent = SafetyAgent()
rec_agent = RecommendationAgent(menus, restaurants)
realtime_agent = RealTimeAgent(restaurants)
review_agent = ReviewAnalysisAgent()
ocr_agent = MenuOCRAgent()
opt_agent = OptimizationAgent(menus, restaurants)

# --- Test Cases ---

def test_safety_agent_shellfish():
    """Test that shellfish allergy blocks seafood."""
    user = user_profiles[user_profiles['user_id'] == 'U002'].iloc[0] # Has shellfish allergy
    menu_item = menus[menus['menu_id'] == 'M002'].iloc[0] # Seafood Pasta
    result = safety_agent.check_safety(user, menu_item)
    assert result['safe'] == False
    assert 'shellfish' in result['reason'].lower()

def test_safety_agent_no_allergy():
    """Test that a safe item passes for a user without relevant allergies."""
    user = user_profiles[user_profiles['user_id'] == 'U001'].iloc[0] # No allergies
    menu_item = menus[menus['menu_id'] == 'M001'].iloc[0] # Grilled Chicken Breast
    result = safety_agent.check_safety(user, menu_item)
    assert result['safe'] == True

def test_safety_agent_missing_allergens():
    """Test that missing allergen data is flagged."""
    user = user_profiles[user_profiles['user_id'] == 'U001'].iloc[0] # No allergies
    menu_item = menus[menus['menu_id'] == 'M005'].iloc[0] # Mystery Soup (allergens column is empty string "")
    result = safety_agent.check_safety(user, menu_item)
    assert result['safe'] == False
    assert 'incomplete_data' in result['reason'].lower()

def test_recommendation_agent_halal_filter():
    """Test that halal users only get halal restaurant options."""
    user = user_profiles[user_profiles['user_id'] == 'U001'].iloc[0] # Halal user
    recs = rec_agent.recommend(user, top_n=10)
    # Get restaurant details for the recommended items
    rec_restaurants = restaurants[restaurants['restaurant_id'].isin(recs['restaurant_id'])]
    # All recommended restaurants should be halal_certified
    assert all(rec_restaurants['halal_certified'] == 'Yes')

def test_recommendation_agent_budget_filter():
    """Test that recommendations respect the user's budget."""
    user = user_profiles[user_profiles['user_id'] == 'U004'].iloc[0] # Budget 30-55
    recs = rec_agent.recommend(user, top_n=10)
    # All recommended prices should be within the budget range
    assert all((recs['price_myr'] >= 30) & (recs['price_myr'] <= 55))

def test_realtime_agent_output():
    """Test that realtime agent returns expected structure."""
    result = realtime_agent.get_wait_time('R001')
    assert 'estimated_wait_minutes' in result
    assert 'is_peak_time' in result
    assert isinstance(result['estimated_wait_minutes'], int)

def test_review_agent_safety_signal():
    """Test that review agent finds safety signals."""
    text = "Great food but I felt sick after - maybe cross-contamination?"
    result = review_agent.analyze_text(text)
    assert 'cross-contamination' in result['safety_signals_found']
    assert result['requires_attention'] == True

def test_optimization_agent_output():
    """Test that optimization agent returns expected structure."""
    result = opt_agent.get_restaurant_insights('R001')
    assert 'average_menu_price' in result
    assert 'total_menu_items' in result
    assert isinstance(result['average_menu_price'], float)

def test_ocr_agent_output():
    """Test that OCR agent returns expected structure."""
    text = "Burger. Ingredients: beef, lettuce, tomato. Allergens: gluten."
    result = ocr_agent.process_menu_text(text)
    assert 'found_allergens_list' in result
    assert 'gluten' in result['found_allergens_list']

# --- Run Tests ---
if __name__ == "__main__":
    pytest.main([__file__, "-v"])
