import random

from pydantic import BaseModel

from schemas.game_config import PGGConfig


class PGGTrialResult(BaseModel):
    other_contributions: list[float]
    total_contribution: float
    share_per_player: float
    feedback_amount: float
    participant_keep_amount: float
    participant_trial_payoff: float


class PGGEngine:
    algorithm_version = "pgg-engine/v1"

    def __init__(self, config: PGGConfig, seed: int):
        self.config = config
        self.seed = seed

    def _rng(self, trial_index: int, player_index: int) -> random.Random:
        return random.Random(f"{self.seed}:pgg:{trial_index}:{player_index}")

    def simulate_trial(self, participant_contribution: float, trial_index: int) -> PGGTrialResult:
        contribution_min, contribution_max = self.config.simulated_agents.contribution_range
        other_contributions: list[float] = []

        for player_index in range(1, self.config.group_size):
            ratio = self._rng(trial_index, player_index).uniform(contribution_min, contribution_max)
            other_contributions.append(round(self.config.endowment * ratio, 2))

        total_contribution = round(participant_contribution + sum(other_contributions), 2)
        common_pot = total_contribution * self.config.multiplier
        share_per_player = round(common_pot / self.config.group_size, 2)
        participant_keep_amount = round(self.config.endowment - participant_contribution, 2)
        participant_trial_payoff = round(participant_keep_amount + share_per_player, 2)

        return PGGTrialResult(
            other_contributions=other_contributions,
            total_contribution=total_contribution,
            share_per_player=share_per_player,
            feedback_amount=share_per_player,
            participant_keep_amount=participant_keep_amount,
            participant_trial_payoff=participant_trial_payoff,
        )
