class ReviewAnalysisAgent:
    """Agent 4: Analyzes text for safety signals and sentiment."""

    SAFETY_SIGNALS = [
        'cross-contamination', 'contamination', 'felt sick', 'made me sick', 'sick',
        'reaction', 'allergic reaction', 'rash', 'itchy', 'breathing', 'swelling',
        'hospital', 'not gluten free', 'hidden', 'mistake', 'wrong'
    ]

    def analyze_text(self, text: str) -> Dict[str, Any]:
        """
        Analyzes a piece of text (e.g., a review or menu description).

        Args:
            text: The text to analyze.

        Returns:
            A dictionary with analysis results.
        """
        text_lower = text.lower()
        found_signals = [signal for signal in self.SAFETY_SIGNALS if signal in text_lower]
        
        # Simple sentiment heuristic (could be replaced with a model)
        positive_indicators = ['good', 'great', 'excellent', 'amazing', 'love', 'perfect', 'delicious', 'yummy']
        negative_indicators = ['bad', 'terrible', 'awful', 'hate', 'horrible', 'disgusting', 'gross', 'overpriced']

        pos_score = sum(text_lower.count(word) for word in positive_indicators)
        neg_score = sum(text_lower.count(word) for word in negative_indicators)

        if pos_score > neg_score:
            sentiment = 'POSITIVE'
        elif neg_score > pos_score:
            sentiment = 'NEGATIVE'
        else:
            sentiment = 'NEUTRAL'


        return {
            'text_snippet': text[:50] + "..." if len(text) > 50 else text,
            'sentiment': sentiment,
            'safety_signals_found': found_signals,
            'requires_attention': len(found_signals) > 0 # Flag if any safety signal is found
        }
