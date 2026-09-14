---
id: T-0018
title: Drag a card between columns
status: done
priority: P0
area: ui
kind: gap
milestone: v0.1
labels: []
blocked_by: []
created: 2026-09-14T19:21:14Z
updated: 2026-09-14T19:21:24Z
---

Dragging is update_ticket and nothing else.

The card moves immediately and the call follows; a reload afterwards keeps the page
honest if the server disagreed. There is no private route for the page -- the board
uses the same door an agent uses.

## Done when
A card dropped in another column has that status on disk.
