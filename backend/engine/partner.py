import random

from pydantic import BaseModel

from schemas.game_config import RTGPartnerConfig


class PartnerResponse(BaseModel):
    return_amount: int
    return_ratio: float | None
    algorithm_log: dict[str, str | None]


class PartnerEngine:
    algorithm_version = "partner-engine/v2-uniform"

    def __init__(self, config: RTGPartnerConfig, seed: int):
        self.config = config
        self.seed = seed

    def _rng(self, trial_index: int, suffix: str) -> random.Random:
        return random.Random(f"{self.seed}:{self.config.code}:{trial_index}:{suffix}")

    def _sample_ratio(self, trial_index: int) -> float:
        if self.config.contingency_schedule:
            return self.config.contingency_schedule[trial_index - 1]

        lower, upper = self.config.mean_return_rate
        return self._rng(trial_index, "base").uniform(lower, upper)

    def generate_return(self, amount_received: float, trial_index: int) -> PartnerResponse:
        if amount_received <= 0:
            return PartnerResponse(
                return_amount=0,
                return_ratio=None,
                algorithm_log={
                    "algorithm_version": self.algorithm_version,
                    "contingency_schedule_id": self.config.contingency_schedule_id,
                },
            )

        sampled_ratio = self._sample_ratio(trial_index)
        clamp_min, clamp_max = self.config.clamp
        actual_ratio = min(max(sampled_ratio, clamp_min), clamp_max)
        return_amount = round(amount_received * actual_ratio)

        return PartnerResponse(
            return_amount=return_amount,
            return_ratio=actual_ratio,
            algorithm_log={
                "algorithm_version": self.algorithm_version,
                "contingency_schedule_id": self.config.contingency_schedule_id,
            },
        )
