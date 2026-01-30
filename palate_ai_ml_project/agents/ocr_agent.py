import pandas as pd
from typing import Dict, Any
import re

class MenuOCRAgent:
    """
    Agent 5: Menu OCR & Ingredient Extraction Agent.
    This is a placeholder/mock agent because actual OCR (using PaddleOCR/LayoutLM)
    requires significant setup (especially GPU) and image data.
    In a real system, this would process images/PDFs.
    For this demo with CSV data, it demonstrates the *interface* and *logic* it would follow
    if it received text output from an OCR process.
    The PDF states OCR extraction status is in the dataset (menu.csv column: OCR_Menu_Extracted_Status).
    """
    
    def process_menu_text(self, extracted_text: str) -> Dict[str, Any]:
        """
        Simulates processing OCR-extracted text.
        In a real system, this takes the raw string from OCR models.
        """
        # --- Simulate OCR-like processing ---
        # 1. Find lines containing keywords related to ingredients/allergens
        lines = extracted_text.lower().split('\n')
        ingredients_section = ""
        allergens_section = ""
        for line in lines:
            if 'ingredient' in line or 'contains' in line or 'allergen' in line:
                if 'ingredient' in line:
                    ingredients_section += " " + line
                elif 'allergen' in line or 'contains' in line:
                    allergens_section += " " + line

        # 2. Extract potential allergens based on keywords (mirroring SafetyAgent logic)
        found_allergens = set()
        for allergen_type, keywords in self._get_allergen_keywords().items():
            for keyword in keywords:
                if keyword in allergens_section:
                    found_allergens.add(allergen_type)
                    break # Found one keyword for this type, add the type

        # 3. Determine status based on findings (mirroring PDF's "Potential Risk" concept)
        # If no allergens were explicitly listed in the OCR text, it's a risk.
        ocr_status = 'VERIFIED' if found_allergens else 'POTENTIAL_RISK'

        return {
            'input_text_preview': extracted_text[:150] + ("..." if len(extracted_text) > 150 else ""),
            'extracted_ingredients_summary': ingredients_section.strip(),
            'extracted_allergens_list': list(found_allergens),
            'ocr_extracted_status': ocr_status, # Matches column name from PDF context and your menu.csv
            'confidence_in_extraction': 0.8 if found_allergens else 0.3 # Simulated confidence
        }

    def _get_allergen_keywords(self):
        """Helper to get allergen keywords, mirroring SafetyAgent."""
        return {
            'shellfish': ['shrimp', 'prawn', 'crab', 'lobster', 'mussel', 'clam', 'oyster', 'seafood', 'anchovies', 'sardines'],
            'gluten': ['wheat', 'barley', 'rye', 'bread', 'pasta', 'flour', 'semolina', 'soy sauce', 'malt'],
            'dairy': ['milk', 'cheese', 'butter', 'cream', 'yogurt', 'whey', 'casein'],
            'egg': ['egg', 'omelet', 'mayonnaise', 'custard'],
            'peanut': ['peanut', 'groundnut', 'arachis'],
            'tree_nuts': ['almond', 'walnut', 'cashew', 'hazelnut', 'pecan', 'pistachio', 'macadamia'],
            'soy': ['soy', 'tofu', 'tempeh', 'edamame', 'miso'],
        }
