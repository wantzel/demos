---
id: T-0037
title: Put real measurements in the README, not adjectives
status: done
priority: P1
area: docs
kind: chore
milestone: v0.2
flow: h2a
labels: []
blocked_by: []
created: 2026-09-14T19:58:49Z
updated: 2026-09-14T19:58:49Z
---

"Fast" and "small" are claims a reader cannot check. Numbers are.

## Measured
Compile 30 ms for ~4,300 lines. Startup to first answered request 6 ms, having read every
ticket file. ticket_stats 0.15 ms (~6,600/s), list_tickets 0.41 ms (~2,400/s). Whole page
20 kB in 0.5 ms. 3.3 MB resident. 602 kB static binary, zero dependencies.

## Why it matters here
The compile time is the one that changes how you work: at 30 ms the build is not a step
you wait for, which is what makes the loop usable by something iterating as fast as an
agent.

## Done when
Every number in the README was measured on a real run, and the README says on what.
