import unittest
from datetime import datetime, timedelta

from services.game_sessions import (
    PARTICIPANT_RESTARTED,
    RTG_POST_BLOCKS,
    RTG_SESSIONS,
    RTG_TRIALS,
    RTG_TUTORIAL_SESSIONS,
    RTG_TUTORIAL_TRIALS,
    latest_completed_session,
    prepare_for_new_session,
)


class FakeDocumentSnapshot:
    def __init__(self, document_id: str, data: dict):
        self.id = document_id
        self._data = data
        self.exists = True

    def to_dict(self) -> dict:
        return dict(self._data)


class FakeDocumentReference:
    def __init__(self, collection: "FakeCollection", document_id: str):
        self.collection = collection
        self.id = document_id

    def get(self) -> FakeDocumentSnapshot:
        data = self.collection.documents.get(self.id)
        if data is None:
            snapshot = FakeDocumentSnapshot(self.id, {})
            snapshot.exists = False
            return snapshot
        return FakeDocumentSnapshot(self.id, data)

    def set(self, data: dict) -> None:
        self.collection.documents[self.id] = dict(data)

    def update(self, updates: dict) -> None:
        self.collection.documents[self.id].update(updates)

    def delete(self) -> None:
        self.collection.documents.pop(self.id, None)


class FakeQuery:
    def __init__(self, collection: "FakeCollection", filters: list[tuple[str, object]] | None = None):
        self.collection = collection
        self.filters = filters or []

    def where(self, field: str, operator: str, value: object) -> "FakeQuery":
        if operator != "==":
            raise NotImplementedError(operator)
        return FakeQuery(self.collection, [*self.filters, (field, value)])

    def stream(self):
        for document_id, data in list(self.collection.documents.items()):
            if all(data.get(field) == value for field, value in self.filters):
                yield FakeDocumentSnapshot(document_id, data)


class FakeCollection(FakeQuery):
    def __init__(self, documents: dict[str, dict] | None = None):
        self.documents = documents or {}
        super().__init__(self)

    def document(self, document_id: str) -> FakeDocumentReference:
        return FakeDocumentReference(self, document_id)


class FakeFirestore:
    def __init__(self, collections: dict[str, dict[str, dict]]):
        self.collections = {
            name: FakeCollection(documents) for name, documents in collections.items()
        }

    def collection(self, name: str) -> FakeCollection:
        return self.collections.setdefault(name, FakeCollection())


class SessionReplacementTest(unittest.TestCase):
    def test_unfinished_session_data_is_purged_and_tombstone_is_retained(self):
        unfinished = {
            "session_id": "rtg-unfinished",
            "user_id": "participant-1",
            "game_type": "rtg_main",
            "config_version": "test",
            "completed": False,
            "block_plan": [{"partner_id": "sensitive-runtime-state"}],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
        db = FakeFirestore(
            {
                RTG_SESSIONS: {unfinished["session_id"]: unfinished},
                RTG_TRIALS: {
                    "trial-1": {"session_id": unfinished["session_id"]},
                },
                RTG_POST_BLOCKS: {
                    "post-1": {"session_id": unfinished["session_id"]},
                },
            }
        )

        prepare_for_new_session(
            db,
            RTG_SESSIONS,
            (RTG_TRIALS, RTG_POST_BLOCKS),
            "participant-1",
            replace_completed=False,
        )

        tombstone = db.collection(RTG_SESSIONS).documents[unfinished["session_id"]]
        self.assertEqual(tombstone["status"], "abandoned")
        self.assertFalse(tombstone["completed"])
        self.assertEqual(tombstone["exclusion_reason"], PARTICIPANT_RESTARTED)
        self.assertNotIn("block_plan", tombstone)
        self.assertEqual(db.collection(RTG_TRIALS).documents, {})
        self.assertEqual(db.collection(RTG_POST_BLOCKS).documents, {})

    def test_report_lookup_returns_only_latest_canonical_completed_session(self):
        now = datetime.utcnow()
        db = FakeFirestore(
            {
                RTG_SESSIONS: {
                    "valid": {
                        "session_id": "valid",
                        "user_id": "participant-1",
                        "completed": True,
                        "updated_at": now,
                    },
                    "invalid-newer": {
                        "session_id": "invalid-newer",
                        "user_id": "participant-1",
                        "completed": True,
                        "status": "invalidated",
                        "invalidated_at": now,
                        "exclusion_reason": PARTICIPANT_RESTARTED,
                        "updated_at": now + timedelta(hours=1),
                    },
                }
            }
        )

        canonical = latest_completed_session(db, RTG_SESSIONS, "participant-1")

        self.assertIsNotNone(canonical)
        self.assertEqual(canonical["session_id"], "valid")

    def test_tutorial_without_passed_comprehension_is_treated_as_unfinished(self):
        tutorial = {
            "session_id": "tutorial-failed-check",
            "user_id": "participant-1",
            "game_type": "rtg_tutorial",
            "completed": True,
            "tutorial_completed": True,
            "comprehension_check_passed": False,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
        db = FakeFirestore(
            {
                RTG_TUTORIAL_SESSIONS: {tutorial["session_id"]: tutorial},
                RTG_TUTORIAL_TRIALS: {
                    "trial-1": {"session_id": tutorial["session_id"]},
                },
            }
        )

        prepare_for_new_session(
            db,
            RTG_TUTORIAL_SESSIONS,
            (RTG_TUTORIAL_TRIALS,),
            "participant-1",
            replace_completed=False,
        )

        tombstone = db.collection(RTG_TUTORIAL_SESSIONS).documents[tutorial["session_id"]]
        self.assertEqual(tombstone["status"], "abandoned")
        self.assertEqual(db.collection(RTG_TUTORIAL_TRIALS).documents, {})


if __name__ == "__main__":
    unittest.main()
