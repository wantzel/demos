---
id: T-0012
title: List the milestones, with how far along they are
status: todo
priority: P2
area: api
kind: gap
milestone: v0.2
labels: []
blocked_by: []
created: 2026-09-14T19:11:59Z
updated: 2026-09-14T19:11:59Z
---

Milestones exist as a field but nothing can enumerate them, so a board cannot draw a
milestone column without fetching every ticket first.

## Done when
list_milestones returns each milestone with its counts per status, so the header of a
board is one call rather than a download.
