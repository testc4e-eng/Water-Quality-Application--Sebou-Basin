"""
Smoke test workflow for popup rules administration.

Covers:
- list rules
- upsert one temporary rule
- get temporary rule
- check merged `/popup-rules`
- clear cache
- delete temporary rule

Usage:
  python backend/scripts/smoke_observatory_popup_rules.py --base-url http://127.0.0.1:8000/api/v1
  python backend/scripts/smoke_observatory_popup_rules.py --base-url http://127.0.0.1:8000/api/v1 --token <JWT>
"""

from __future__ import annotations

import argparse
import json
import sys
from typing import Any
from urllib import request, error


TEMP_LAYER_KEY = "__smoke_popup_rules_tmp__"


def _headers(token: str | None) -> dict[str, str]:
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    return headers


def _http_json(method: str, url: str, headers: dict[str, str], payload: dict | None = None) -> tuple[int, str]:
    body = None
    if payload is not None:
        body = json.dumps(payload).encode("utf-8")
    req = request.Request(url, data=body, method=method, headers=headers)
    try:
        with request.urlopen(req, timeout=30) as resp:
            data = resp.read().decode("utf-8", errors="replace")
            return int(resp.status), data
    except error.HTTPError as e:
        data = e.read().decode("utf-8", errors="replace")
        return int(e.code), data


def _assert_ok(status: int, body: str, step: str) -> Any:
    if status < 200 or status >= 300:
        raise RuntimeError(f"[{step}] HTTP {status} - {body[:500]}")
    try:
        return json.loads(body)
    except Exception:
        raise RuntimeError(f"[{step}] invalid JSON response: {body[:300]}")


def run(base_url: str, token: str | None) -> None:
    h = _headers(token)
    created = False

    print(f"[1/6] GET {base_url}/observatory/popup-rules/list")
    status, body = _http_json("GET", f"{base_url}/observatory/popup-rules/list", h)
    payload = _assert_ok(status, body, "list")
    print(f"  -> count={payload.get('count')}")

    print(f"[2/6] POST {base_url}/observatory/popup-rules/upsert")
    rule = {
        "layer_key": TEMP_LAYER_KEY,
        "title": "SMOKE TEST RULE",
        "name_fields": ["name", "label"],
        "type_fields": ["type", "categorie"],
        "class_fields": ["classe"],
        "code_fields": ["code", "id"],
        "actif": True,
    }
    status, body = _http_json("POST", f"{base_url}/observatory/popup-rules/upsert", h, payload=rule)
    payload = _assert_ok(status, body, "upsert")
    if not payload.get("ok"):
        raise RuntimeError("[upsert] expected ok=true")
    created = True
    print("  -> upsert ok")

    print(f"[3/6] GET {base_url}/observatory/popup-rules/{TEMP_LAYER_KEY}")
    status, body = _http_json("GET", f"{base_url}/observatory/popup-rules/{TEMP_LAYER_KEY}", h)
    payload = _assert_ok(status, body, "get_one")
    if payload.get("layer_key") != TEMP_LAYER_KEY:
        raise RuntimeError("[get_one] layer_key mismatch")
    print("  -> get one ok")

    print(f"[4/6] GET {base_url}/observatory/popup-rules")
    status, body = _http_json("GET", f"{base_url}/observatory/popup-rules", h)
    payload = _assert_ok(status, body, "merged_rules")
    rules = payload.get("rules", {})
    if TEMP_LAYER_KEY not in rules:
        raise RuntimeError("[merged_rules] temp rule not present in merged rules")
    print("  -> merged rules include temp rule")

    print(f"[5/6] POST {base_url}/observatory/cache/clear")
    status, body = _http_json("POST", f"{base_url}/observatory/cache/clear", h)
    payload = _assert_ok(status, body, "cache_clear")
    print(f"  -> cache cleared: {payload}")

    print(f"[6/6] DELETE {base_url}/observatory/popup-rules/{TEMP_LAYER_KEY}")
    status, body = _http_json("DELETE", f"{base_url}/observatory/popup-rules/{TEMP_LAYER_KEY}", h)
    payload = _assert_ok(status, body, "delete")
    if not payload.get("ok"):
        raise RuntimeError("[delete] expected ok=true")
    created = False
    print("  -> delete ok")

    print("SMOKE TEST SUCCESS")

    # final clear to avoid stale cache
    _http_json("POST", f"{base_url}/observatory/cache/clear", h)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--base-url",
        default="http://127.0.0.1:8000/api/v1",
        help="API base URL including /api/v1",
    )
    parser.add_argument(
        "--token",
        default=None,
        help="Optional bearer JWT token",
    )
    args = parser.parse_args()

    try:
        run(args.base_url.rstrip("/"), args.token)
        return 0
    except Exception as exc:
        print(f"SMOKE TEST FAILED: {exc}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
