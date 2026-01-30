import pandas as pd
from typing import Dict, Any

class SafetyAgent:
    """Agent 1: Hard safety constraints for allergens and health conditions."""
    
    ALLERGEN_KEYWORDS = {
        'shellfish': ['shrimp', 'prawn', 'crab', 'lobster', 'mussel', 'clam', 'oyster', 'seafood', 'anchovies', 'sardines'],
        'gluten': ['wheat', 'barley', 'rye', 'bread', 'pasta', 'flour', 'semolina', 'soy sauce', 'malt'],
        'dairy': ['milk', 'cheese', 'butter', 'cream', 'yogurt', 'whey', 'casein'],
        'egg': ['egg', 'omelet', 'mayonnaise', 'custard'],
        'peanut': ['peanut', 'groundnut', 'arachis'],
        'tree_nuts': ['almond', 'walnut', 'cashew', 'hazelnut', 'pecan', 'pistachio', 'macadamia'],
        'soy': ['soy', 'tofu', 'tempeh', 'edamame', 'miso'],
    }
    
    # Note: Chronic conditions like diabetes/hypertension require nutritional info, which is not in the provided menu.csv
    # For now, we focus on allergens. A full implementation would require nutritional data.

    def check_safety(self, user_profile: pd.Series, menu_item: pd.Series) -> Dict[str, Any]:
        """
        Evaluates if a menu item is safe for a user based on their profile.

        Args:
            user_profile: A row from user_profiles.csv.
            menu_item: A row from menu.csv.

        Returns:
            A dictionary with safety assessment results.
        """
        user_allergies_str = user_profile['allergies']
        # Handle multiple allergies separated by '_'
        user_allergies = [a.strip() for a in user_allergies_str.split('_')] if user_allergies_str != 'none' else []

        menu_ingredients = menu_item['ingredients_clean']
        menu_allergens = menu_item['allergens']

        # Hard Rule 1: Missing allergen data is a potential risk
        if pd.isna(menu_item['allergens']) or menu_item['allergens'].strip() == '':
            return {
                'safe': False,
                'reason': 'INCOMPLETE_DATA: Allergen information missing.',
                'risk_level': 'HIGH'
            }

        # Check for allergen matches
        for user_allergy in user_allergies:
            # Direct match in the allergens column
            if user_allergy in menu_allergens:
                return {
                    'safe': False,
                    'reason': f'DIRECT_ALLERGEN_MATCH: Menu explicitly lists "{user_allergy}".',
                    'risk_level': 'CRITICAL'
                }
            
            # Check against ingredient keywords (more thorough check)
            if user_allergy in self.ALLERGEN_KEYWORDS:
                allergen_keywords = self.ALLERGEN_KEYWORDS[user_allergy]
                for keyword in allergen_keywords:
                    if keyword in menu_ingredients:
                        return {
                            'safe': False,
                            'reason': f'INGREDIENT_KEYWORD_MATCH: Found "{keyword}" related to "{user_allergy}" in ingredients.',
                            'risk_level': 'CRITICAL'
                        }


        # Check for Celiac Disease (specifically against gluten)
        if 'celiac' in user_profile['health_conditions'].lower():
            if 'gluten' in menu_allergens or any(keyword in menu_ingredients for keyword in self.ALLERGEN_KEYWORDS.get('gluten', [])):
                 return {
                    'safe': False,
                    'reason': 'CELIAC_DISEASE_GLUTEN: Gluten found, unsafe for celiac disease.',
                    'risk_level': 'CRITICAL'
                }


        # If no conflicts found
        return {
            'safe': True,
            'reason': 'NO_CONFLICTS_FOUND: Item appears safe based on provided profile and menu data.',
            'risk_level': 'LOW'
        }
