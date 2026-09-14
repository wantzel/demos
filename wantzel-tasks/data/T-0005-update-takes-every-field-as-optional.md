---
id: T-0005
title: Update takes every field as optional
status: done
priority: P1
area: api
kind: gap
milestone: v0.1
labels: []
blocked_by: []
created: 2026-09-14T19:08:56Z
updated: 2026-09-14T19:11:59Z
---

Send only what changes. There is no separate patch call, because "not sent" and
"sent as null" are different requests and the generated parser already tells them
apart: _ok says whether a field arrived, _null whether it arrived as null.

## Done when
Updating one field leaves the others untouched, and sending null clears a field that
is allowed to be empty.
