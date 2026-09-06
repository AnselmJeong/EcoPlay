import unittest

from services.game_sessions import RTG_SESSIONS, RTG_TUTORIAL_SESSIONS, RTGSessionService
from test_session_replacement import FakeFirestore


class RTGBlockResetTest(unittest.TestCase):
    def test_new_partner_starts_with_fresh_balances(self):
        session = {
            "session_id": "rtg-reset-test",
            "user_id": "participant-1",
            "config_version": "test",
            "block_plan": [
                {
                    "block_index": 1,
                    "partner_id": "partner-1",
                    "partner_type": 1,
                    "public_label": "Partner A",
                },
                {
                    "block_index": 2,
                    "partner_id": "partner-2",
                    "partner_type": 2,
                    "public_label": "Partner B",
                },
            ],
            "current_block_index": 1,
            "current_trial_within_block": 15,
            "completed_trials_count": 15,
            "cumulative_payoff": 918.0,
            "current_balance": 918.0,
            "current_partner_balance": 2754.0,
            "status": "awaiting_post_block",
            "completed": False,
        }
        db = FakeFirestore({
            RTG_SESSIONS: {session["session_id"]: session},
            RTG_TUTORIAL_SESSIONS: {
                "passed-tutorial": {
                    "user_id": "participant-1",
                    "tutorial_completed": True,
                    "comprehension_check_passed": True,
                    "completed_trials_count": 10,
                },
            },
        })
        service = RTGSessionService(db)

        response = service.submit_post_block(
            user_id="participant-1",
            session_id="rtg-reset-test",
            partner_classification_response="high_return",
            classification_confidence=5,
            willingness_to_play_again=5,
        )

        expected_balance = float(service.config.rtg.endowment)
        self.assertEqual(response["session"]["current_block_index"], 2)
        self.assertEqual(response["session"]["current_trial_within_block"], 1)
        self.assertEqual(response["session"]["current_balance"], expected_balance)
        self.assertEqual(response["session"]["current_partner_balance"], expected_balance)
        self.assertEqual(response["session"]["endowment"], expected_balance)
        self.assertEqual(session["current_balance"], expected_balance)
        self.assertEqual(session["current_partner_balance"], expected_balance)


if __name__ == "__main__":
    unittest.main()
