---
id: T-0032
title: Show the direction on the card, not only in the filter
status: done
priority: P1
area: ui
kind: gap
milestone: v0.2
flow: h2a
labels: [decision]
blocked_by: []
created: 2026-09-14T19:58:49Z
updated: 2026-09-14T19:58:49Z
---

`flow` existed as a field and was invisible. A property you cannot see while scanning is
a property nobody maintains.

## The decision
A badge on every card and a column in the list, drawn as the direction itself: H→A,
A→H, A→A, H→H. The arrow IS the meaning, so it needs no legend. Colour carries the
same information a second time -- green for work going to an agent, accent for work
waiting on a person -- because on a busy board you read colour before glyphs.

## Done when
You can see at a glance which tickets are waiting on a human, without opening any.
