import pandas as pd
import streamlit as st
from agents import (
    SafetyAgent, RecommendationAgent, RealTimeAgent,
    ReviewAnalysisAgent, MenuOCRAgent, OptimizationAgent
)

# Load data
@st.cache_data
def load_data():
    user_profiles = pd.read_csv('data/user_profiles.csv')
    restaurants = pd.read_csv('data/restaurants.csv')
    menus = pd.read_csv('data/menu.csv')
    return user_profiles, restaurants, menus

user_profiles, restaurants, menus = load_data()

# Initialize agents
safety_agent = SafetyAgent()
rec_agent = RecommendationAgent(menus, restaurants)
realtime_agent = RealTimeAgent(restaurants)
review_agent = ReviewAnalysisAgent()
ocr_agent = MenuOCRAgent()
opt_agent = OptimizationAgent(menus, restaurants)

# --- Streamlit UI ---
st.set_page_config(layout="wide", page_title="Palate AI Demo")
st.title("🍽️ Palate AI: 6-Agent System Demo")
st.write("Demonstrating the integration of all 6 AI agents.")

# User Selection
user_id = st.selectbox("Select a User Profile:", user_profiles['user_id'].unique())
user_profile = user_profiles[user_profiles['user_id'] == user_id].iloc[0]

# Restaurant Selection for specific agent demos
resto_id = st.selectbox("Select a Restaurant (for specific demos):", restaurants['restaurant_id'].unique())

col1, col2 = st.columns(2)

with col1:
    st.subheader(f"User Profile: {user_id}")
    st.json(user_profile.to_dict())

with col2:
    st.subheader(f"Selected Restaurant: {resto_id}")
    st.json(restaurants[restaurants['restaurant_id'] == resto_id].iloc[0].to_dict())


# --- Agent Interactions ---
st.header("🤖 Agent Interactions")

# 1. Recommendation Agent
st.subheader("1. Recommendation Agent Output")
recommended_items = rec_agent.recommend(user_profile, top_n=5)
st.dataframe(recommended_items)

# 2. Safety Agent (Applied to recommendations)
st.subheader("2. Safety Agent Applied to Recommendations")
safe_recommendations = []
for _, item in recommended_items.iterrows():
    menu_details = menus[menus['menu_id'] == item['menu_id']].iloc[0]
    safety_result = safety_agent.check_safety(user_profile, menu_details)
    safe_rec_entry = item.to_dict()
    safe_rec_entry.update(safety_result)
    safe_recommendations.append(safe_rec_entry)

safest_items = [item for item in safe_recommendations if item['safe']]
blocked_items = [item for item in safe_recommendations if not item['safe']]

if safest_items:
    st.success("✅ Safe Recommendations:")
    st.dataframe(pd.DataFrame(safest_items))
else:
    st.error("❌ No safe recommendations found based on your profile.")

if blocked_items:
    st.warning("⚠️ Blocked Items (Safety Reasons):")
    st.dataframe(pd.DataFrame(blocked_items))


# 3. Real-Time Agent
st.subheader("3. Real-Time Agent Output (Wait Time Simulation)")
if not safest_items:
    st.info("Using first recommended item for wait time demo (even if blocked).")
    demo_item_resto = recommended_items.iloc[0]['restaurant_id'] if not recommended_items.empty else resto_id
else:
    demo_item_resto = safest_items[0]['restaurant_id'] if safest_items else resto_id

if demo_item_resto:
    wait_info = realtime_agent.get_wait_time(demo_item_resto)
    st.json(wait_info)


# 4. Review Agent (Simulated Review)
st.subheader("4. Review Agent Output (Simulated Review Analysis)")
simulated_review = f"We loved the {recommended_items.iloc[0]['dish_name']} at {demo_item_resto}, but I have a shellfish allergy and felt a bit queasy afterwards. Maybe there was cross-contamination?"
if not recommended_items.empty:
    review_analysis = review_agent.analyze_text(simulated_review)
    st.json(review_analysis)
else:
    st.info("No recommendation selected to simulate a review.")


# 5. OCR Agent (Simulated OCR Text)
st.subheader("5. OCR Agent Output (Simulated Menu OCR)")
simulated_ocr_text = """
Seafood Pasta
Ingredients: Fresh linguine, succulent shrimp, mussels, white wine, garlic, olive oil
Allergens: Shellfish, Gluten, Dairy (Cream used in sauce)
"""
ocr_results = ocr_agent.process_menu_text(simulated_ocr_text)
st.json(ocr_results)


# 6. Optimization Agent
st.subheader("6. Restaurant Optimization Agent Output")
opt_insights = opt_agent.get_restaurant_insights(resto_id)
st.json(opt_insights)


st.markdown("---")
st.caption("Demo integrating 6 AI agents for Palate AI using provided datasets. Safety is the top priority.")