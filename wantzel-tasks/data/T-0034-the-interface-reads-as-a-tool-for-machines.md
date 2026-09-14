---
id: T-0034
title: The interface reads as a tool for machines
status: done
priority: P1
area: ui
kind: bug
milestone: v0.2
flow: h2a
labels: []
blocked_by: []
created: 2026-09-14T19:58:49Z
updated: 2026-09-14T20:00:34Z
---

Feedback, and correct: 15px base with details at .71rem made it look like an ops
dashboard rather than something you sit and think in. Everything was scaled DOWN from an
already small base.

## The decision
16px/1.65 base, nothing below .74rem, more padding, and a modern UI face named ahead of
the generic stack (Inter, SF Pro, Segoe UI Variable) -- `system-ui` resolves to something
grotesque on Linux. Titles at 550 rather than 600: the weight still separates them from
the meta row without reading as heavy.

## Done when
It looks like a product someone chose, not a dashboard someone configured.

## Work log
- [agent] 2026-09-14 - base 15->16px/1.65, floor .71rem->.74rem, titles 600->550, Inter/SF Pro named first

## Comments

### 2026-09-14T20:00:34Z floris
The typeface still feels technical. Can it be lighter, more modern?

### 2026-09-14T20:00:34Z agent-ui [agent]
Root cause: everything was scaled DOWN from a 15px base -- details at .71rem/.72rem, so the smallest text on the page was ~10.7px. That reads as density, and density reads as 'ops tool'.

Also: `system-ui` on Linux resolves to a grotesque (DejaVu/Cantarell depending on the box), which is why it looked more technical here than it would on a Mac. Naming Inter and SF Pro Text ahead of the generic stack fixes that without loading a webfont -- which we cannot do anyway, since the page makes zero external requests.

Titles moved 600 -> 550. At 16px, 600 reads heavy; 550 still separates the title from the meta row.
