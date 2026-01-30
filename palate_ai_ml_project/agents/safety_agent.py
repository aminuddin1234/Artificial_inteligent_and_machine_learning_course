# agents/safety_agent.py
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, MultiLabelBinarizer
from sklearn.metrics import classification_report, confusion_matrix
import xgboost as xgb
import joblib
import re
from typing import Dict, Any, Tuple

class SafetyAgent:
    """
    Agent 1: Safety & Risk Assessment Agent using XGBoost.
    This agent trains a model to predict if a menu item is safe for a user.
    """
    
    def __init__(self):
        self.model = xgb.XGBClassifier(
            objective='binary:logistic',
            eval_metric='auc',
            n_estimators=100,
            max_depth=6,
            learning_rate=0.1,
            scale_pos_weight=50, # Approximate imbalance: 2-7% alerts vs 93-98% safe (from PDF)
            random_state=42
        )
        self.user_allergies_encoder = MultiLabelBinarizer()
        self.menu_allergens_encoder = MultiLabelBinarizer()
        self.health_conditions_encoder = MultiLabelBinarizer()
        self.cuisine_encoder = LabelEncoder()
        self.trained = False
        # Add a fallback flag in case training fails critically
        self.fallback_active = False 

    def _safe_split(self, x):
        """
        Safely splits a string on '_', handling NaN, empty strings, and 'none'.
        """
        if pd.isna(x) or str(x).strip() == '':
            return []
        return str(x).split('_') if str(x) != 'none' else []


    def _preprocess_data(self, user_profiles: pd.DataFrame, menus: pd.DataFrame, restaurants: pd.DataFrame):
        """
        Creates a merged dataset for training the safety classifier.
        Target variable: 1 if unsafe (alert), 0 if safe.
        """
        # Merge user and menu data
        full_data = user_profiles.assign(key=1).merge(menus.assign(key=1), on='key').drop('key', axis=1)
        
        # Merge with restaurants for cuisine type
        full_data = full_data.merge(restaurants[['restaurant_id', 'cuisine_type']], on='restaurant_id', how='left')

        # --- Feature Engineering ---
        # 1. Parse user allergies and health conditions (assuming '_' separation)
        full_data['user_allergies_list'] = full_data['allergies'].apply(self._safe_split)
        full_data['health_conditions_list'] = full_data['health_conditions'].apply(self._safe_split)

        # 2. Parse menu allergens
        full_data['menu_allergens_list'] = full_data['allergens'].apply(self._safe_split)

        # 3. Create target variable based on allergen/condition overlap (this is a proxy, a real system needs confirmed labels)
        # For demo, let's assume an item is unsafe if there's an exact match in allergens or a known health condition conflict
        # (e.g., gluten for celiac, shellfish for shellfish allergy)
        # Also consider 'POTENTIAL_RISK' safety_status as unsafe for training purposes.
        
        def is_unsafe(row):
            user_alls = set(row['user_allergies_list'])
            menu_alls = set(row['menu_allergens_list'])
            user_health = set(row['health_conditions_list'])
            
            # Check allergen overlap
            if user_alls.intersection(menu_alls):
                return 1
            
            # Check health condition conflicts (simplified)
            if 'celiac_disease' in user_health and 'gluten' in menu_alls:
                return 1
            # Note: More complex checks for diabetes/hypertension require nutritional data not in the provided menu.csv
            # Example: if 'diabetes' in user_health and 'sugar' in row['ingredients_clean'].lower(): 
            #      return 1
            # Example: if 'hypertension' in user_health and 'salt' in row['ingredients_clean'].lower(): 
            #      return 1
                 
            # Check for potential risk status
            if row['safety_status'] == 'POTENTIAL_RISK':
                return 1
                
            return 0

        full_data['target_is_unsafe'] = full_data.apply(is_unsafe, axis=1)

        # Drop rows where target is unknown or invalid (if any logic errors occur)
        # full_data = full_data.dropna(subset=['target_is_unsafe']) # This shouldn't be necessary if is_unsafe always returns 0 or 1

        # Encode categorical features
        user_allergies_encoded = self.user_allergies_encoder.fit_transform(full_data['user_allergies_list'])
        menu_allergens_encoded = self.menu_allergens_encoder.fit_transform(full_data['menu_allergens_list'])
        health_conditions_encoded = self.health_conditions_encoder.fit_transform(full_data['health_conditions_list'])
        cuisine_encoded = self.cuisine_encoder.fit_transform(full_data['cuisine_type'])

        # Create feature matrix X
        X = pd.DataFrame(user_allergies_encoded, columns=self.user_allergies_encoder.classes_)
        X = pd.concat([X, pd.DataFrame(menu_allergens_encoded, columns=self.menu_allergens_encoder.classes_)], axis=1)
        X = pd.concat([X, pd.DataFrame(health_conditions_encoded, columns=self.health_conditions_encoder.classes_)], axis=1)
        X['cuisine_encoded'] = cuisine_encoded
        X['budget_min'] = full_data['budget_range_myr'].str.split('-').apply(lambda x: int(x[0]))
        X['budget_max'] = full_data['budget_range_myr'].str.split('-').apply(lambda x: int(x[1]))
        X['price'] = full_data['price_myr']
        # Feature for missing ingredient/allergen data (critical for safety)
        X['missing_allergen_info'] = (full_data['allergens'].isna()) | (full_data['allergens'] == '') | (full_data['allergens'] == 'none')

        y = full_data['target_is_unsafe']

        return X, y


    def train(self, user_profiles: pd.DataFrame, menus: pd.DataFrame, restaurants: pd.DataFrame):
        """
        Trains the XGBoost model on the provided datasets.
        """
        print("Preprocessing data for Safety Agent...")
        try:
            X, y = self._preprocess_data(user_profiles, menus, restaurants)
        except Exception as e:
            print(f"Error during preprocessing: {e}")
            print("Falling back to rule-based safety checks only.")
            self.fallback_active = True
            self.trained = False
            return

        print(f"Training data shape: {X.shape}, Target distribution:\n{y.value_counts()}")
        
        if X.empty or y.empty or len(y.unique()) < 2:
             print("Insufficient data for training (e.g., no positive/negative examples or empty data).")
             print("Falling back to rule-based safety checks only.")
             self.fallback_active = True
             self.trained = False
             return

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

        print("Training XGBoost model...")
        try:
            self.model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)
        except Exception as e:
            print(f"Error during model training: {e}")
            print("Falling back to rule-based safety checks only.")
            self.fallback_active = True
            self.trained = False
            return

        # Evaluate on test set
        y_pred = self.model.predict(X_test)
        print("\n--- Safety Agent Model Evaluation ---")
        print(classification_report(y_test, y_pred))
        print(confusion_matrix(y_test, y_pred))
        
        self.trained = True
        self.fallback_active = False
        print("Safety Agent training completed.\n")


    def _preprocess_single_input(self, user_profile: pd.Series, menu_item: pd.Series, restaurant: pd.Series):
        """
        Preprocesses a single user-menu pair for prediction.
        """
        if not self.trained:
            # This function should not be called if not trained, but handle gracefully
            return None

        # Create a temporary dataframe row similar to training
        temp_row = pd.DataFrame({
            'allergies': [user_profile['allergies']],
            'health_conditions': [user_profile['health_conditions']],
            'allergens': [menu_item['allergens']],
            'cuisine_type': [restaurant['cuisine_type']],
            'budget_range_myr': [user_profile['budget_range_myr']],
            'price_myr': [menu_item['price_myr']],
            'ingredients_clean': [menu_item['ingredients_clean']],
            'safety_status': [menu_item['safety_status']]
        })

        # Parse lists using the safe function
        temp_row['user_allergies_list'] = temp_row['allergies'].apply(self._safe_split)
        temp_row['health_conditions_list'] = temp_row['health_conditions'].apply(self._safe_split)
        temp_row['menu_allergens_list'] = temp_row['allergens'].apply(self._safe_split)

        # Encode features
        user_allergies_encoded = self.user_allergies_encoder.transform(temp_row['user_allergies_list'])
        menu_allergens_encoded = self.menu_allergens_encoder.transform(temp_row['menu_allergens_list'])
        health_conditions_encoded = self.health_conditions_encoder.transform(temp_row['health_conditions_list'])
        cuisine_encoded = self.cuisine_encoder.transform(temp_row['cuisine_type'])

        X_single = pd.DataFrame(user_allergies_encoded, columns=self.user_allergies_encoder.classes_)
        X_single = pd.concat([X_single, pd.DataFrame(menu_allergens_encoded, columns=self.menu_allergens_encoder.classes_)], axis=1)
        X_single = pd.concat([X_single, pd.DataFrame(health_conditions_encoded, columns=self.health_conditions_encoder.classes_)], axis=1)
        X_single['cuisine_encoded'] = cuisine_encoded
        X_single['budget_min'] = temp_row['budget_range_myr'].str.split('-').apply(lambda x: int(x[0]))
        X_single['budget_max'] = temp_row['budget_range_myr'].str.split('-').apply(lambda x: int(x[1]))
        X_single['price'] = temp_row['price_myr']
        X_single['missing_allergen_info'] = (temp_row['allergens'].isna()) | (temp_row['allergens'] == '') | (temp_row['allergens'] == 'none')

        # Ensure columns match training data (fill missing with 0)
        # Get the feature names from the trained model booster
        expected_feature_names = self.model._Booster.feature_names
        for col in expected_feature_names:
             if col not in X_single.columns:
                 X_single[col] = 0
        X_single = X_single.reindex(columns=expected_feature_names, fill_value=0)

        return X_single


    def check_safety(self, user_profile: pd.Series, menu_item: pd.Series, restaurant: pd.Series) -> Dict[str, Any]:
        """
        Evaluates if a menu item is safe for a user using the trained model or rules.
        """
        # --- Fallback to Rule-Based if Model Not Trained Properly ---
        if not self.trained or self.fallback_active:
            print("Warning: Safety Agent not fully trained, using rule-based checks.")
            # Basic check for missing allergens (critical safety rule)
            if pd.isna(menu_item['allergens']) or menu_item['allergens'].strip() == '':
                return {
                    'safe': False,
                    'reason': 'MISSING_ALLERGEN_INFO_FALLBACK (Critical Safety Rule)',
                    'risk_level': 'HIGH',
                    'model_confidence': None
                }
            # Basic check for direct allergen match (critical safety rule)
            user_alls_list = self._safe_split(user_profile['allergies'])
            menu_alls_list = self._safe_split(menu_item['allergens']) # Fixed: was 'menu_allergens_list'
            if set(user_alls_list).intersection(set(menu_alls_list)):
                return {
                    'safe': False,
                    'reason': f'DIRECT_ALLERGEN_MATCH_FALLBACK: {set(user_alls_list).intersection(set(menu_alls_list))}',
                    'risk_level': 'CRITICAL',
                    'model_confidence': None
                }
            # Basic check for celiac/gluten (critical safety rule)
            if 'celiac_disease' in self._safe_split(user_profile['health_conditions']) and 'gluten' in menu_alls_list:
                 return {
                    'safe': False,
                    'reason': 'CELIAC_GLUTEN_MATCH_FALLBACK (Critical Safety Rule)',
                    'risk_level': 'CRITICAL',
                    'model_confidence': None
                }
            # If no rule-based conflict
            return {
                'safe': True,
                'reason': 'FALLBACK_NO_DIRECT_CONFLICT',
                'risk_level': 'LOW',
                'model_confidence': None
            }


        # --- Use Trained Model if Available ---
        X_single = self._preprocess_single_input(user_profile, menu_item, restaurant)
        if X_single is None: # Shouldn't happen if trained, but good practice
             return {'safe': False, 'reason': 'PREPROCESSING_ERROR', 'risk_level': 'UNKNOWN', 'model_confidence': None}

        try:
            prediction_proba = self.model.predict_proba(X_single)[0] # [prob_safe, prob_unsafe]
            prediction = self.model.predict(X_single)[0]
        except Exception as e:
            print(f"Error during model prediction: {e}. Falling back to rule-based checks.")
            # Fallback to rules within the trained branch
            if pd.isna(menu_item['allergens']) or menu_item['allergens'].strip() == '':
                return {
                    'safe': False,
                    'reason': 'MISSING_ALLERGEN_INFO_FALLBACK_IN_PRED (Critical Safety Rule)',
                    'risk_level': 'HIGH',
                    'model_confidence': None
                }
            user_alls_list = self._safe_split(user_profile['allergies'])
            menu_alls_list = self._safe_split(menu_item['allergens']) # Fixed
            if set(user_alls_list).intersection(set(menu_alls_list)):
                return {
                    'safe': False,
                    'reason': f'DIRECT_ALLERGEN_MATCH_FALLBACK_IN_PRED: {set(user_alls_list).intersection(set(menu_alls_list))}',
                    'risk_level': 'CRITICAL',
                    'model_confidence': None
                }
            if 'celiac_disease' in self._safe_split(user_profile['health_conditions']) and 'gluten' in menu_alls_list:
                 return {
                    'safe': False,
                    'reason': 'CELIAC_GLUTEN_MATCH_FALLBACK_IN_PRED (Critical Safety Rule)',
                    'risk_level': 'CRITICAL',
                    'model_confidence': None
                }
            return {
                'safe': True,
                'reason': 'FALLBACK_NO_DIRECT_CONFLICT_IN_PRED',
                'risk_level': 'LOW',
                'model_confidence': None
            }


        # Interpret ML results
        prob_unsafe = prediction_proba[1]
        is_safe_ml = prediction == 0 # 0 means safe in our target encoding

        # Determine outcome based on ML prediction and confidence
        if not is_safe_ml or prob_unsafe > 0.7: # Threshold for high risk based on probability
            risk_level_ml = "CRITICAL" if prob_unsafe > 0.9 else ("HIGH" if prob_unsafe > 0.7 else "MEDIUM")
            # Apply Hard Constraints *after* ML prediction as a secondary check/sanity check
            # Example: Shellfish allergy + Seafood dish (from PDF: "Hard-coded safety rules(e.g., shellfish allergy → flag all seafood)")
            user_alls_list = self._safe_split(user_profile['allergies'])
            menu_alls_list = self._safe_split(menu_item['allergens']) # Fixed
            menu_ingredients_lower = menu_item['ingredients_clean'].lower()

            if 'shellfish' in user_alls_list and ('shellfish' in menu_alls_list or 'seafood' in menu_ingredients_lower):
                 return {
                     'safe': False,
                     'reason': f'ML_Predicted_Unsafe ({prob_unsafe:.2f}) BUT_HARD_RULE_Shellfish_Allergy_Seafood_Conflict',
                     'risk_level': 'CRITICAL', # Override to critical for hard rule
                     'model_confidence': prob_unsafe
                 }
            # Example: Celiac + Gluten
            if 'celiac_disease' in self._safe_split(user_profile['health_conditions']) and 'gluten' in menu_alls_list:
                 return {
                     'safe': False,
                     'reason': f'ML_Predicted_Unsafe ({prob_unsafe:.2f}) BUT_HARD_RULE_Celiac_Gluten_Conflict',
                     'risk_level': 'CRITICAL', # Override to critical for hard rule
                     'model_confidence': prob_unsafe
                 }
            # If no hard rule conflict, return ML result
            return {
                'safe': False,
                'reason': f'ML_Model_Predicted_Unsafe (Confidence: {prob_unsafe:.2f})',
                'risk_level': risk_level_ml,
                'model_confidence': prob_unsafe
            }
        else:
            # ML says Safe, but still apply critical hard rules as a final check
            user_alls_list = self._safe_split(user_profile['allergies'])
            menu_alls_list = self._safe_split(menu_item['allergens']) # Fixed
            menu_ingredients_lower = menu_item['ingredients_clean'].lower()
            user_health_list = self._safe_split(user_profile['health_conditions'])

            # Example hard rule: Shellfish allergy + Seafood dish
            if 'shellfish' in user_alls_list and ('shellfish' in menu_alls_list or 'seafood' in menu_ingredients_lower):
                 return {
                     'safe': False,
                     'reason': 'HARD_RULE_Shellfish_Allergy_Seafood_Conflict (Overrides ML Safe)',
                     'risk_level': 'CRITICAL',
                     'model_confidence': prob_unsafe # Confidence of the *incorrect* safe prediction
                 }
            # Example hard rule: Celiac + Gluten
            if 'celiac_disease' in user_health_list and 'gluten' in menu_alls_list:
                 return {
                     'safe': False,
                     'reason': 'HARD_RULE_Celiac_Gluten_Conflict (Overrides ML Safe)',
                     'risk_level': 'CRITICAL',
                     'model_confidence': prob_unsafe # Confidence of the *incorrect* safe prediction
                 }
            # Final check: Missing allergen data (should ideally be caught earlier, but double-check)
            if pd.isna(menu_item['allergens']) or menu_item['allergens'].strip() == '':
                 return {
                     'safe': False,
                     'reason': 'MISSING_ALLERGEN_INFO (Critical Safety Rule Overrides ML Safe)',
                     'risk_level': 'HIGH',
                     'model_confidence': prob_unsafe # Confidence of the *incorrect* safe prediction
                 }

            # If ML says safe AND all hard checks pass
            return {
                'safe': True,
                'reason': f'ML_Model_Predicted_Safe (Confidence: {1-prob_unsafe:.2f})',
                'risk_level': 'LOW',
                'model_confidence': 1 - prob_unsafe
            }
