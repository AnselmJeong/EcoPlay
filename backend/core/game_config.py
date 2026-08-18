import os
from pathlib import Path

import yaml
from pydantic import ValidationError

from schemas.game_config import GameConfig

_game_config: GameConfig | None = None


def get_game_config_path() -> Path:
    default_path = Path(__file__).resolve().parent.parent / "config" / "game_config.yaml"
    return Path(os.getenv("GAME_CONFIG_PATH", default_path)).expanduser().resolve()


def load_game_config(force_reload: bool = False) -> GameConfig:
    global _game_config

    if _game_config is not None and not force_reload:
        return _game_config

    config_path = get_game_config_path()
    if not config_path.exists():
        raise RuntimeError(f"Game config file not found: {config_path}")

    try:
        with config_path.open("r", encoding="utf-8") as config_file:
            raw_config = yaml.safe_load(config_file)
        _game_config = GameConfig.model_validate(raw_config)
        return _game_config
    except ValidationError as exc:
        raise RuntimeError(f"Invalid game config in {config_path}: {exc}") from exc
    except Exception as exc:  # pragma: no cover - startup path
        raise RuntimeError(f"Failed to load game config from {config_path}: {exc}") from exc


def get_game_config() -> GameConfig:
    return load_game_config(force_reload=False)
