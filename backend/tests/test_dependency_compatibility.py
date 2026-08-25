import unittest
from importlib.metadata import version


class DependencyCompatibilityTest(unittest.TestCase):
    def test_google_api_core_avoids_firestore_default_database_regression(self):
        """2.35.0 makes Firestore reject `(default)` as `%28default%29`."""
        installed = tuple(
            int(part) for part in version("google-api-core").split(".")[:3]
        )
        self.assertLess(installed, (2, 35, 0))


if __name__ == "__main__":
    unittest.main()
