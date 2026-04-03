from typing import Literal

from pydantic import BaseModel, Field, model_validator


class PGGBotProfileConfig(BaseModel):
    name: str | None = None
    base_contribution_ratio: float = Field(ge=0.0, le=1.0)
    responsiveness: float = Field(ge=0.0)


class PGGSimulatedAgentsConfig(BaseModel):
    contribution_range: tuple[float, float]
    strategy: Literal["uniform_random", "fixed", "conditional_cooperation"]
    reference_contribution_ratio: float = Field(default=0.25, ge=0.0, le=1.0)
    bots: list[PGGBotProfileConfig] = Field(default_factory=list)

    @model_validator(mode="after")
    def validate_range(self):
        lower, upper = self.contribution_range
        if not 0.0 <= lower <= upper <= 1.0:
            raise ValueError("PGG contribution_range must stay within [0, 1].")
        if self.strategy in {"fixed", "conditional_cooperation"} and not self.bots:
            raise ValueError(f"PGG strategy '{self.strategy}' requires bot profiles.")
        for bot in self.bots:
            if not lower <= bot.base_contribution_ratio <= upper:
                raise ValueError("PGG bot base_contribution_ratio must stay within contribution_range.")
        return self


class PGGConfig(BaseModel):
    trials: int = Field(gt=0)
    blocks: int = Field(gt=0)
    endowment: float = Field(gt=0)
    group_size: int = Field(gt=1)
    multiplier: float = Field(gt=0)
    simulated_agents: PGGSimulatedAgentsConfig

    @model_validator(mode="after")
    def validate_simulated_agents(self):
        if self.simulated_agents.bots and len(self.simulated_agents.bots) != self.group_size - 1:
            raise ValueError("PGG bot profile count must match group_size - 1.")
        return self


class TutorialConfig(BaseModel):
    trials: int = Field(gt=0)
    role: Literal["trustee"]
    endowment: float = Field(gt=0)
    multiplier: float = Field(gt=0)
    sender_investment_schedule: list[float] = Field(min_length=1)

    @model_validator(mode="after")
    def validate_schedule_length(self):
        if len(self.sender_investment_schedule) != self.trials:
            raise ValueError("Tutorial sender_investment_schedule must match trials.")
        if any(value < 0 or value > self.endowment for value in self.sender_investment_schedule):
            raise ValueError("Tutorial sender investments must be within [0, endowment].")
        return self


class RTGPartnerConfig(BaseModel):
    name: str
    code: int = Field(gt=0)
    mean_return_rate: tuple[float, float]
    clamp: tuple[float, float] = (0.0, 1.0)
    contingency_schedule_id: str | None = None
    contingency_schedule: list[float] | None = None

    @model_validator(mode="after")
    def validate_ranges(self):
        min_rate, max_rate = self.mean_return_rate
        clamp_min, clamp_max = self.clamp
        if not 0.0 <= min_rate <= max_rate <= 1.0:
            raise ValueError("mean_return_rate must stay within [0, 1].")
        if not 0.0 <= clamp_min <= clamp_max <= 1.0:
            raise ValueError("clamp must stay within [0, 1].")
        if self.contingency_schedule is not None and any(
            not clamp_min <= value <= clamp_max for value in self.contingency_schedule
        ):
            raise ValueError("contingency_schedule values must stay inside clamp range.")
        return self


class RTGConfig(BaseModel):
    trials_per_partner: int = Field(gt=0)
    endowment: float = Field(gt=0)
    multiplier: float = Field(gt=0)
    block_order: Literal["randomized", "fixed"]
    partners: list[RTGPartnerConfig] = Field(min_length=1)

    @model_validator(mode="after")
    def validate_partner_constraints(self):
        codes = [partner.code for partner in self.partners]
        if len(set(codes)) != len(codes):
            raise ValueError("RTG partner codes must be unique.")
        for partner in self.partners:
            if partner.contingency_schedule and len(partner.contingency_schedule) != self.trials_per_partner:
                raise ValueError(
                    f"Partner {partner.name} contingency_schedule must match trials_per_partner."
                )
        return self


class PostBlockQuestionsConfig(BaseModel):
    enabled: bool = True
    partner_classification_options: list[Literal["high_return", "low_return", "unpredictable"]]
    confidence_range: tuple[int, int]
    willingness_range: tuple[int, int]

    @model_validator(mode="after")
    def validate_ranges(self):
        if self.confidence_range != (1, 7):
            raise ValueError("confidence_range must be [1, 7].")
        if self.willingness_range != (1, 7):
            raise ValueError("willingness_range must be [1, 7].")
        return self


class GameConfig(BaseModel):
    version: str
    pgg: PGGConfig
    tutorial: TutorialConfig
    rtg: RTGConfig
    post_block_questions: PostBlockQuestionsConfig
