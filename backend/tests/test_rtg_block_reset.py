import unittest

from services.game_sessions import RTG_POST_BLOCKS, RTG_SESSIONS, RTGSessionService


class FakeDocumentSnapshot:
    def __init__(self, document_id: str, data: dict):
        self.id = document_id
        self._data = data
        self.exists = True

    def to_dict(self) -> dict:
        return dict(self._data)


class FakeDocumentReference:
    def __init__(self, document_id: str, data: dict):
        self.id = document_id
        self._data = data

    def get(self) -> FakeDocumentSnapshot:
        return FakeDocumentSnapshot(self.id, self._data)

    def update(self, updates: dict) -> None:
        self._data.update(updates)


class FakeCollection:
    def __init__(self, documents: dict[str, dict] | None = None):
        self.documents = documents or {}
        self.added: list[dict] = []

    def document(self, document_id: str) -> FakeDocumentReference:
        return FakeDocumentReference(document_id, self.documents[document_id])

    def add(self, data: dict):
        self.added.append(dict(data))
        return None, FakeDocumentReference(f"added-{len(self.added)}", self.added[-1])


class FakeFirestore:
    def __init__(self, session: dict):
        self.collections = {
            RTG_SESSIONS: FakeCollection({session["session_id"]: session}),
            RTG_POST_BLOCKS: FakeCollection(),
        }

    def collection(self, name: str) -> FakeCollection:
        return self.collections[name]


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
        db = FakeFirestore(session)
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
