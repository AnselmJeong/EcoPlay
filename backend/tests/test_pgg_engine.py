import unittest

from engine.pgg import PGGEngine
from schemas.game_config import GameConfig


def build_config() -> GameConfig:
    return GameConfig.model_validate(
        {
            "version": "test",
            "pgg": {
                "trials": 15,
                "blocks": 1,
                "endowment": 10,
                "group_size": 5,
                "multiplier": 1.5,
                "simulated_agents": {
                    "strategy": "conditional_cooperation",
                    "contribution_range": [0.05, 0.45],
                    "reference_contribution_ratio": 0.25,
                    "bots": [
                        {"name": "Stable Cooperator", "base_contribution_ratio": 0.18, "responsiveness": 0.30},
                        {"name": "Reciprocator", "base_contribution_ratio": 0.20, "responsiveness": 0.55},
                        {"name": "Wait-and-See", "base_contribution_ratio": 0.12, "responsiveness": 0.70},
                        {"name": "Optimistic Cooperator", "base_contribution_ratio": 0.26, "responsiveness": 0.40},
                    ],
                },
            },
            "tutorial": {
                "trials": 1,
                "role": "trustee",
                "endowment": 10,
                "multiplier": 3,
                "sender_investment_schedule": [2],
            },
            "rtg": {
                "trials_per_partner": 1,
                "endowment": 10,
                "multiplier": 3,
                "block_order": "fixed",
                "partners": [
                    {
                        "name": "Test Partner",
                        "code": 1,
                        "mean_return_rate": [0.5, 0.5],
                        "clamp": [0.0, 1.0],
                    }
                ],
            },
            "post_block_questions": {
                "enabled": True,
                "partner_classification_options": ["high_return", "low_return", "unpredictable"],
                "confidence_range": [1, 7],
                "willingness_range": [1, 7],
            },
        }
    )


class PGGEngineTest(unittest.TestCase):
    def setUp(self):
        self.engine = PGGEngine(build_config().pgg, seed=123)

    def test_first_trial_uses_base_contribution_profile(self):
        result = self.engine.simulate_trial(participant_contribution=3, trial_index=1)
        self.assertEqual(result.other_contributions, [1.8, 2.0, 1.2, 2.6])

    def test_higher_previous_user_contribution_increases_bot_contributions(self):
        result = self.engine.simulate_trial(
            participant_contribution=3,
            trial_index=2,
            previous_participant_contribution=3.5,
        )
        self.assertEqual(result.other_contributions, [2.1, 2.55, 1.9, 3.0])

    def test_low_previous_user_contribution_applies_lower_clip(self):
        result = self.engine.simulate_trial(
            participant_contribution=3,
            trial_index=2,
            previous_participant_contribution=0.5,
        )
        self.assertEqual(result.other_contributions, [1.2, 0.9, 0.5, 1.8])

    def test_uniform_random_strategy_stays_in_configured_range(self):
        config = build_config().pgg
        config.simulated_agents.strategy = "uniform_random"
        engine = PGGEngine(config, seed=123)

        result = engine.simulate_trial(participant_contribution=3, trial_index=1)

        self.assertEqual(len(result.other_contributions), config.group_size - 1)
        self.assertTrue(
            all(0.5 <= contribution <= 4.5 for contribution in result.other_contributions)
        )


if __name__ == "__main__":
    unittest.main()
