import unittest

from fastapi import HTTPException

from core.auth import (
    extract_medical_record_number,
    require_matching_medical_record_number,
)


class AuthOwnershipTest(unittest.TestCase):
    def test_extracts_participant_number_from_study_email(self):
        user = {"uid": "firebase-uid", "email": "12345678@eco.play"}

        self.assertEqual(extract_medical_record_number(user), "12345678")

    def test_allows_own_participant_record(self):
        user = {"uid": "firebase-uid", "email": "12345678@eco.play"}

        result = require_matching_medical_record_number(user, "12345678")

        self.assertEqual(result, "12345678")

    def test_rejects_another_participant_record(self):
        user = {"uid": "firebase-uid", "email": "12345678@eco.play"}

        with self.assertRaises(HTTPException) as raised:
            require_matching_medical_record_number(user, "87654321")

        self.assertEqual(raised.exception.status_code, 403)


if __name__ == "__main__":
    unittest.main()
