---
id: T-0035
title: The phone view spends five rows before the first ticket
status: done
priority: P0
area: ui
kind: bug
milestone: v0.2
flow: a2h
labels: []
blocked_by: []
created: 2026-09-14T19:58:49Z
updated: 2026-09-14T20:00:34Z
---

Measured on a 420px screen, from the screenshots: the header wrapped to three rows and
the filter bar to four. Five rows of chrome before a single card, and `New ticket`
pushed off the screen entirely -- so you could not create a ticket on a phone at all.

## The decision
Filters go in a sideways scroller on one row; `New ticket` is pinned outside it, because
an action you cannot reach is an action you do not have. The tagline and the ticket count
are hidden -- they explain the project to a first-time desktop reader and cost a whole row
on a phone.

## Done when
Two rows of chrome, six tickets visible, and every action still reachable.

## Work log
- [agent] 2026-09-14 - measured 420px: 5 rows of chrome, 1 card visible, #new below the fold
- 2026-09-14 - chose a sideways scroller with the action pinned outside it
- [agent] 2026-09-14 - after: 2 rows of chrome, 6 cards visible, #new reachable -- reshot to confirm

## Comments

### 2026-09-14T20:00:34Z floris
Look at the screenshot at 420px. I count five rows before I see a ticket.

### 2026-09-14T20:00:34Z agent-ui [agent]
Confirmed from docs/img/board-phone-light.png. Header wraps to 3 rows (h1 + count + seg + tog exceed 420px), .bar wraps to 4 (five selects sized to their longest option). New ticket is pushed below the fold entirely -- it is not reachable on a phone.

Options considered: (a) hamburger menu -- hides the filters behind a tap, and the filters are the point of a backlog; (b) collapse filters into one 'filter' sheet -- same objection, plus a second surface to build; (c) horizontal scroller with the primary action pinned outside it. Chose (c): nothing is hidden, one row, and the action stays put.

### 2026-09-14T20:00:34Z floris
Yes, (c). But then New ticket has to sit outside the scroller.
