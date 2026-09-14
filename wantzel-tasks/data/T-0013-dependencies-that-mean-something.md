---
id: T-0013
title: Dependencies that mean something
status: todo
priority: P2
area: api
kind: gap
milestone: v0.3
labels: []
blocked_by: []
created: 2026-09-14T19:11:59Z
updated: 2026-09-14T20:00:34Z
---

`blocked_by` holds ids today and nothing checks them. Two things are missing and both
are cheap:

- an id that does not exist should be refused at the moment it is set, not discovered
  later by a reader;
- a ticket whose blockers are all done should be visible, because "what can I start
  now?" is the question a backlog exists to answer.

## Done when
Setting a blocker that does not exist is refused, and list_tickets can filter on
"ready": todo, and nothing unfinished blocking it.

## Comments

### 2026-09-14T20:00:34Z floris
I think this is the last one a small but complete system actually needs.

### 2026-09-14T20:00:34Z agent-b [agent]
Agreed, and it is cheap because next_ticket already has q.unblocked -- a blocker only blocks if it still exists and is not done. Two things left: refuse a blocker id that does not exist at the moment it is SET (not discovered later by a reader), and expose 'ready' as a filter so 'what can I start now?' is one call.

Note: q.unblocked already treats a deleted blocker as satisfied, deliberately -- a phantom reference should not freeze a ticket forever.
