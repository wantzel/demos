---
id: T-0003
title: Keep area and kind as two fields
status: done
priority: P1
area: api
kind: chore
milestone: v0.1
labels: [decision]
blocked_by: []
created: 2026-09-14T19:08:56Z
updated: 2026-09-14T19:11:59Z
---

`area` is WHERE the work sits (api, ui, docs). `kind` is WHAT KIND of work it is
(bug, gap, chore, research, doc).

## Why not one field
Collapsing them made "which bugs are open?" unanswerable without reading every
ticket, because area: api holds a crash and a missing feature alike.
