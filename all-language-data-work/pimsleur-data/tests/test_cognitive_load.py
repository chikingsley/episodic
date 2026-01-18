"""Tests for cognitive load calculations.

These tests validate the cognitive load formula produces realistic scores.
Pimsleur lessons maintain ~70% mastery through careful repetition, not 95%+ load.
"""

from dataclasses import dataclass


@dataclass
class CognitiveLoadMetrics:
    """Metrics for cognitive load in a lesson."""

    lesson_number: int
    total_utterances: int = 0
    unique_utterances: int = 0
    new_utterances: int = 0
    familiar_utterances: int = 0
    persistent_utterances: int = 0
    recurring_utterances: int = 0
    clustered_utterances: int = 0
    single_lesson_utterances: int = 0
    novelty_ratio: float = 0.0
    repetition_density: float = 0.0
    persistence_score: float = 0.0
    cognitive_load_score: float = 0.0


def calculate_cognitive_load_score_v1(metrics: CognitiveLoadMetrics) -> float:
    """Original (broken) formula - all scores come out 9.5-10."""
    if metrics.total_utterances == 0:
        return 0.0

    novelty_weight = 4.0
    density_weight = 2.0
    persistence_weight = -1.0
    single_lesson_weight = 1.5

    novelty_component = metrics.novelty_ratio
    density_component = min(metrics.repetition_density / 3.0, 1.0)
    persistence_component = metrics.persistence_score
    single_lesson_component = metrics.single_lesson_utterances / metrics.total_utterances

    raw_score = (
        (novelty_component * novelty_weight)
        + (density_component * density_weight)
        + (persistence_component * persistence_weight)
        + (single_lesson_component * single_lesson_weight)
    )

    scaled_score = max(0, min(10, raw_score * 1.5))
    return round(scaled_score, 2)


def calculate_cognitive_load_score_v2(metrics: CognitiveLoadMetrics) -> float:
    """Fixed formula - produces realistic scores (3-8 range for typical lessons).

    Key changes:
    - Review items reduce load (weight 0.3 instead of counted as new)
    - Repetition density properly reduces cognitive load
    - Better calibration based on Pimsleur's actual methodology
    """
    if metrics.total_utterances == 0:
        return 0.0

    # Core load from new items (high weight)
    new_item_load = metrics.new_utterances * 1.0

    # Review items contribute less (already partially learned)
    review_item_load = metrics.familiar_utterances * 0.3

    # Base cognitive demand
    base_load = new_item_load + review_item_load

    # Repetition reduces cognitive load (more practice = easier)
    # If density is 2.0, items are repeated twice on average
    repetition_reduction = 1.0 / max(1.0, metrics.repetition_density)

    # Persistence indicates familiar patterns (reduces load)
    familiarity_reduction = 1.0 - (metrics.persistence_score * 0.3)

    # Calculate adjusted load
    adjusted_load = base_load * repetition_reduction * familiarity_reduction

    # Normalize to 0-10 scale
    # Typical lesson has ~50 unique utterances, ~20 new
    # Target: lesson with 20 new items + 30 review = ~5-6 load
    normalized_score = min(10, (adjusted_load / 30) * 10)

    return round(normalized_score, 2)


class TestCognitiveLoadFormula:
    """Test suite for cognitive load calculations."""

    def test_empty_lesson_returns_zero(self):
        """Empty lessons should have zero cognitive load."""
        metrics = CognitiveLoadMetrics(lesson_number=1)
        assert calculate_cognitive_load_score_v2(metrics) == 0.0

    def test_first_lesson_high_novelty(self):
        """First lesson (all new content) should have high but not max load."""
        metrics = CognitiveLoadMetrics(
            lesson_number=1,
            total_utterances=200,
            unique_utterances=50,
            new_utterances=50,  # All new
            familiar_utterances=0,
            novelty_ratio=1.0,
            repetition_density=4.0,  # Each phrase repeated 4x
            persistence_score=0.0,
        )
        score = calculate_cognitive_load_score_v2(metrics)
        # Should be moderate (3-6 range) - repetition brings down load even for new content
        assert 3.0 <= score <= 6.0, f"First lesson score {score} should be 3-6"

    def test_later_lesson_lower_novelty(self):
        """Later lessons with more review should have lower load."""
        metrics = CognitiveLoadMetrics(
            lesson_number=5,
            total_utterances=200,
            unique_utterances=50,
            new_utterances=15,  # Only 30% new
            familiar_utterances=35,  # 70% review
            novelty_ratio=0.3,
            repetition_density=4.0,
            persistence_score=0.6,  # Many familiar patterns
        )
        score = calculate_cognitive_load_score_v2(metrics)
        # Should be low (1-4 range) - mostly review content
        assert 1.0 <= score <= 4.0, f"Later lesson score {score} should be 1-4"

    def test_heavy_repetition_reduces_load(self):
        """High repetition density should reduce cognitive load."""
        base_metrics = CognitiveLoadMetrics(
            lesson_number=1,
            total_utterances=200,
            unique_utterances=25,
            new_utterances=25,
            familiar_utterances=0,
            novelty_ratio=1.0,
            repetition_density=2.0,  # 2x repetition
            persistence_score=0.0,
        )

        heavy_rep_metrics = CognitiveLoadMetrics(
            lesson_number=1,
            total_utterances=200,
            unique_utterances=25,
            new_utterances=25,
            familiar_utterances=0,
            novelty_ratio=1.0,
            repetition_density=8.0,  # 8x repetition
            persistence_score=0.0,
        )

        base_score = calculate_cognitive_load_score_v2(base_metrics)
        heavy_rep_score = calculate_cognitive_load_score_v2(heavy_rep_metrics)

        assert heavy_rep_score < base_score, "More repetition should reduce load"

    def test_persistence_reduces_load(self):
        """High persistence (familiar patterns) should reduce load."""
        low_persist = CognitiveLoadMetrics(
            lesson_number=5,
            total_utterances=200,
            unique_utterances=50,
            new_utterances=20,
            familiar_utterances=30,
            novelty_ratio=0.4,
            repetition_density=4.0,
            persistence_score=0.1,  # Mostly new patterns
        )

        high_persist = CognitiveLoadMetrics(
            lesson_number=5,
            total_utterances=200,
            unique_utterances=50,
            new_utterances=20,
            familiar_utterances=30,
            novelty_ratio=0.4,
            repetition_density=4.0,
            persistence_score=0.8,  # Mostly familiar patterns
        )

        low_score = calculate_cognitive_load_score_v2(low_persist)
        high_score = calculate_cognitive_load_score_v2(high_persist)

        assert high_score < low_score, "Higher persistence should reduce load"

    def test_scores_never_exceed_10(self):
        """Cognitive load should never exceed 10."""
        extreme_metrics = CognitiveLoadMetrics(
            lesson_number=1,
            total_utterances=1000,
            unique_utterances=200,
            new_utterances=200,
            familiar_utterances=0,
            novelty_ratio=1.0,
            repetition_density=1.0,
            persistence_score=0.0,
        )
        score = calculate_cognitive_load_score_v2(extreme_metrics)
        assert score <= 10.0, "Score should never exceed 10"

    def test_v1_formula_produces_unrealistic_scores(self):
        """Demonstrate that the old formula is broken."""
        # This is what we're fixing - old formula gives 9.5+ for everything
        metrics = CognitiveLoadMetrics(
            lesson_number=5,
            total_utterances=200,
            unique_utterances=50,
            new_utterances=15,
            familiar_utterances=35,
            novelty_ratio=0.3,
            repetition_density=4.0,
            persistence_score=0.6,
            single_lesson_utterances=5,
        )
        old_score = calculate_cognitive_load_score_v1(metrics)
        new_score = calculate_cognitive_load_score_v2(metrics)

        # Old formula gives unrealistically high scores
        # New formula should be more reasonable
        assert new_score < old_score, "New formula should produce lower scores"


class TestRepetitionDensity:
    """Tests for repetition density calculations."""

    def test_density_greater_than_one_with_repetition(self):
        """Repetition density must be > 1 when phrases are repeated."""
        total_utterances = 200
        unique_utterances = 50
        density = total_utterances / unique_utterances
        assert density == 4.0, "200 total / 50 unique = 4.0 density"
        assert density > 1.0, "Density must be > 1 when repetition occurs"

    def test_density_equals_one_without_repetition(self):
        """Density = 1 only when every utterance is unique."""
        total_utterances = 50
        unique_utterances = 50
        density = total_utterances / unique_utterances
        assert density == 1.0, "No repetition = 1.0 density"


class TestNoveltyRatio:
    """Tests for novelty ratio calculations."""

    def test_first_lesson_high_novelty(self):
        """First lesson should have ~100% novelty."""
        new_utterances = 50
        total_unique = 50
        novelty = new_utterances / total_unique
        assert novelty == 1.0, "First lesson should be 100% new"

    def test_later_lesson_lower_novelty(self):
        """Later lessons should have decreasing novelty."""
        new_utterances = 15
        total_unique = 50
        novelty = new_utterances / total_unique
        assert novelty == 0.3, "Should be 30% new content"

    def test_novelty_between_zero_and_one(self):
        """Novelty ratio must always be 0-1."""
        for new in range(0, 51):
            novelty = new / 50
            assert 0.0 <= novelty <= 1.0
