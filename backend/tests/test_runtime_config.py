import os
import unittest
from unittest.mock import patch

from main import get_allowed_origins


class RuntimeConfigTest(unittest.TestCase):
    def test_development_defaults_to_local_frontend_origins(self):
        with patch.dict(os.environ, {"ENVIRONMENT": "development"}, clear=True):
            self.assertEqual(
                get_allowed_origins(),
                ["http://localhost:3000", "http://localhost:9000"],
            )

    def test_production_requires_explicit_origin(self):
        with patch.dict(os.environ, {"ENVIRONMENT": "production"}, clear=True):
            self.assertEqual(get_allowed_origins(), [])

    def test_configured_origins_are_normalized(self):
        environment = {
            "ENVIRONMENT": "production",
            "CORS_ALLOWED_ORIGINS": (
                "https://ecoplay.example/ , https://admin.ecoplay.example"
            ),
        }
        with patch.dict(os.environ, environment, clear=True):
            self.assertEqual(
                get_allowed_origins(),
                ["https://ecoplay.example", "https://admin.ecoplay.example"],
            )


if __name__ == "__main__":
    unittest.main()
