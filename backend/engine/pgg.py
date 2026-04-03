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
    algorithm_version = "pgg-engine/v2"

    def __init__(self, config: PGGConfig, seed: int):
        self.config = config
        self.seed = seed

    def _rng(self, trial_index: int, player_index: int) -> random.Random:
        return random.Random(f"{self.seed}:pgg:{trial_index}:{player_index}")

    def _clip_ratio(self, ratio: float) -> float:
        contribution_min, contribution_max = self.config.simulated_agents.contribution_range
        return max(contribution_min, min(contribution_max, ratio))

    def _simulate_other_contributions(
        self,
        trial_index: int,
        previous_participant_contribution: float | None,
    ) -> list[float]:
        strategy = self.config.simulated_agents.strategy
        if strategy == "conditional_cooperation":
            reference_ratio = self.config.simulated_agents.reference_contribution_ratio
            previous_ratio = (
                reference_ratio
                if previous_participant_contribution is None
                else previous_participant_contribution / self.config.endowment
            )
            delta = previous_ratio - reference_ratio
            return [
                round(
                    self.config.endowment
                    * self._clip_ratio(bot.base_contribution_ratio + (bot.responsiveness * delta)),
                    2,
                )
                for bot in self.config.simulated_agents.bots
            ]

        if strategy == "fixed":
            return [
                round(self.config.endowment * self._clip_ratio(bot.base_contribution_ratio), 2)
                for bot in self.config.simulated_agents.bots
            ]

        other_contributions: list[float] = []
        for player_index in range(1, self.config.group_size):
            ratio = self._rng(trial_index, player_index).uniform(contribution_min, contribution_max)
            other_contributions.append(round(self.config.endowment * ratio, 2))
        return other_contributions

    def simulate_trial(
        self,
        participant_contribution: float,
        trial_index: int,
        previous_participant_contribution: float | None = None,
    ) -> PGGTrialResult:
        other_contributions = self._simulate_other_contributions(trial_index, previous_participant_contribution)

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
