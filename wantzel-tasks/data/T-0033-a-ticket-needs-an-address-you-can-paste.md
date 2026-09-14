---
id: T-0033
title: A ticket needs an address you can paste
status: done
priority: P1
area: ui
kind: gap
milestone: v0.2
flow: h2a
labels: []
blocked_by: []
created: 2026-09-14T19:58:49Z
updated: 2026-09-14T19:58:49Z
---

Opening a ticket changed nothing in the address bar, so there was no way to send someone
-- or some agent -- to a specific ticket. In a system built for handing work over, that
is a strange thing to be missing.

## The decision
`#T-0023` opens that ticket on load, the back button closes it, and opening one pushes
history. A link to a ticket is now something you paste into a chat or into a prompt.

## Done when
Loading /#T-0023 opens it directly, and back returns to the board.
