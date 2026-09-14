---
id: T-0014
title: Ordering within a status, so a board has a top
status: todo
priority: P2
area: api
kind: gap
milestone: v0.3
labels: []
blocked_by: []
created: 2026-09-14T19:11:59Z
updated: 2026-09-14T19:11:59Z
---

Newest first is a sensible default and a poor plan. A backlog has an order someone
chose, and the top of it is the answer to "what next?".

## Done when
A ticket carries an `order` number, list_tickets can sort by it, and moving one is a
single call rather than renumbering the column.
