import pandas as pd
from textblob import TextBlob
from typing import Dict, Any, List
import re

class ReviewAnalysisAgent:
    """
    Agent 4: Review & Sentiment Analysis Agent.
    Uses TextBlob for basic sentiment analysis and custom keyword matching for safety signals.
    (Note: For production, BERT/RoBERTa from PDF would be preferred)
    """
    
    def __init__(self):
        # Keywords for safety signals, as mentioned in PDF
        self.safety_keywords = [
            'cross-contamination', 'contamination', 'felt sick', 'made me sick', 'sick',
            'reaction', 'allergic reaction', 'rash', 'itchy', 'breathing', 'swelling',
            'hospital', 'not gluten free', 'hidden', 'mistake', 'wrong', 'burned', 'undercooked'
        ]
        # Keywords for allergens to double-check against text
        self.allergen_keywords = [
            'shellfish', 'gluten', 'dairy', 'egg', 'peanut', 'tree nut', 'soy', 'sesame'
        ]


    def analyze_review(self, review_text: str) -> Dict[str, Any]:
        """
        Analyzes a review text for sentiment and safety signals.
        """
        # 1. Sentiment Analysis using TextBlob
        blob = TextBlob(review_text)
        polarity = blob.sentiment.polarity # -1 (neg) to 1 (pos)
        subjectivity = blob.sentiment.subjectivity # 0 (obj) to 1 (subj)

        if polarity > 0.1: sentiment_label = 'POSITIVE'
        elif polarity < -0.1: sentiment_label = 'NEGATIVE'
        else: sentiment_label = 'NEUTRAL'

        # 2. Safety Signal Detection
        found_safety_signals = []
        found_allergens_mentioned = []
        text_lower = review_text.lower()

        for signal in self.safety_keywords:
            if signal in text_lower:
                found_safety_signals.append(signal)

        for allergen in self.allergen_keywords:
            if allergen in text_lower:
                found_allergens_mentioned.append(allergen)

        # 3. Determine if requires attention
        requires_attention = len(found_safety_signals) > 0

        return {
            'original_text': review_text,
            'processed_text_preview': review_text[:100] + ("..." if len(review_text) > 100 else ""),
            'sentiment_label': sentiment_label,
            'sentiment_polarity': polarity,
            'sentiment_subjectivity': subjectivity,
            'safety_signals_found': found_safety_signals,
            'allergens_mentioned_in_text': found_allergens_mentioned,
            'requires_attention': requires_attention,
            'analysis_confidence_approx': 0.7 # Approximate, TextBlob is rule-based
        }
