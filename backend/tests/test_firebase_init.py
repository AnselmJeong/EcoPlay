import unittest
from unittest.mock import patch

import core.firebase as firebase_module


class FirebaseInitializationTest(unittest.TestCase):
    def test_uses_application_default_credentials_without_local_key(self):
        app = object()

        with (
            patch.object(firebase_module.firebase_admin, "_apps", {}),
            patch.object(firebase_module, "get_local_credential_path", return_value=None),
            patch.object(
                firebase_module.firebase_admin,
                "initialize_app",
                return_value=app,
            ) as initialize_app,
        ):
            result = firebase_module.init_firebase()

        initialize_app.assert_called_once_with()
        self.assertIs(result, app)


if __name__ == "__main__":
    unittest.main()
