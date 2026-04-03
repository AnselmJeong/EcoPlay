import random

from pydantic import BaseModel

from schemas.game_config import RTGPartnerConfig


class PartnerResponse(BaseModel):
    return_amount: int
    return_ratio: float | None
    algorithm_log: dict[str, float | int | str | None]


class PartnerEngine:
    algorithm_version = "partner-engine/v1"

    def __init__(self, config: RTGPartnerConfig, seed: int):
        self.config = config
        self.seed = seed

    def _rng(self, trial_index: int, suffix: str) -> random.Random:
        return random.Random(f"{self.seed}:{self.config.code}:{trial_index}:{suffix}")

    def _base_ratio(self, trial_index: int) -> float:
        if self.config.contingency_schedule:
            return self.config.contingency_schedule[trial_index - 1]

        lower, upper = self.config.mean_return_rate
        return self._rng(trial_index, "base").uniform(lower, upper)

    def _noise(self, trial_index: int) -> float:
        if self.config.contingency_schedule:
            return 0.0

        noise_cfg = self.config.noise_distribution
        rng = self._rng(trial_index, "noise")
        if noise_cfg.type == "uniform":
            raw_noise = rng.uniform(-noise_cfg.sd, noise_cfg.sd)
        else:
            raw_noise = rng.gauss(noise_cfg.mean, noise_cfg.sd)
        return raw_noise * self.config.volatility_parameter

    def generate_return(self, amount_received: float, trial_index: int) -> PartnerResponse:
        if amount_received <= 0:
            return PartnerResponse(
                return_amount=0,
                return_ratio=None,
                algorithm_log={
                    "planned_ratio": 0.0,
                    "actual_ratio": None,
                    "noise_term": 0.0,
                    "volatility_parameter": self.config.volatility_parameter,
                    "seed": self.seed,
                    "algorithm_version": self.algorithm_version,
                    "contingency_schedule_id": self.config.contingency_schedule_id,
                },
            )

        base_ratio = self._base_ratio(trial_index)
        noise_term = self._noise(trial_index)
        planned_ratio = base_ratio + noise_term
        clamp_min, clamp_max = self.config.clamp
        actual_ratio = min(max(planned_ratio, clamp_min), clamp_max)
        return_amount = round(amount_received * actual_ratio)

        return PartnerResponse(
            return_amount=return_amount,
            return_ratio=actual_ratio,
            algorithm_log={
                "planned_ratio": round(planned_ratio, 6),
                "actual_ratio": round(actual_ratio, 6),
                "noise_term": round(noise_term, 6),
                "volatility_parameter": self.config.volatility_parameter,
                "seed": self.seed,
                "algorithm_version": self.algorithm_version,
                "contingency_schedule_id": self.config.contingency_schedule_id,
            },
        )
