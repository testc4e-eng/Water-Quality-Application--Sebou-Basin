import unittest

from fastapi import HTTPException
from pydantic import ValidationError

from app.schemas.layer_config import LayerConfigCreate, LayerConfigUpdate
from app.services.layer_config_service import LayerConfigService


def build_valid_update_payload() -> LayerConfigUpdate:
    return LayerConfigUpdate(
        geometry_type="point",
        style_config={
            "type": "simple",
            "point": {
                "color": "#3498db",
                "radius": 6,
                "opacity": 0.85,
                "strokeColor": "#ffffff",
                "strokeWidth": 1,
            },
        },
        popup_config={
            "fields": [
                {
                    "name": "nom_station",
                    "alias": "Station",
                    "order": 1,
                    "visible": True,
                    "format": None,
                }
            ]
        },
    )


class _FakeResult:
    def mappings(self):
        return self

    def first(self):
        return None


class _FakeSession:
    def execute(self, *_args, **_kwargs):
        return _FakeResult()

    def rollback(self):
        return None

    def commit(self):
        return None


class LayerConfigTests(unittest.TestCase):
    def test_create_config_invalid_color(self):
        with self.assertRaises(ValidationError):
            LayerConfigCreate(
                layer_name="stations_pluvio",
                geometry_type="point",
                style_config={
                    "type": "simple",
                    "point": {
                        "color": "blue",
                        "radius": 6,
                        "opacity": 0.85,
                        "strokeColor": "#ffffff",
                        "strokeWidth": 1,
                    },
                },
                popup_config={"fields": []},
            )

    def test_popup_field_order_duplicate_rejected(self):
        with self.assertRaises(ValidationError):
            LayerConfigCreate(
                layer_name="stations_pluvio",
                geometry_type="point",
                style_config={
                    "type": "simple",
                    "point": {
                        "color": "#3498db",
                        "radius": 6,
                        "opacity": 0.85,
                        "strokeColor": "#ffffff",
                        "strokeWidth": 1,
                    },
                },
                popup_config={
                    "fields": [
                        {
                            "name": "nom_station",
                            "alias": "Station",
                            "order": 1,
                            "visible": True,
                            "format": None,
                        },
                        {
                            "name": "value",
                            "alias": "Valeur",
                            "order": 1,
                            "visible": True,
                            "format": "number",
                        },
                    ]
                },
            )

    def test_update_nonexistent_layer_returns_404(self):
        service = LayerConfigService(_FakeSession())

        with self.assertRaises(HTTPException) as err:
            service.update("missing_layer", build_valid_update_payload())

        self.assertEqual(err.exception.status_code, 404)
        self.assertIn("missing_layer", str(err.exception.detail))


if __name__ == "__main__":
    unittest.main()
