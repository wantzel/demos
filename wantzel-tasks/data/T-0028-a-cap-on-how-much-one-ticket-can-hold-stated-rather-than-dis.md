---
id: T-0028
title: A cap on how much one ticket can hold, stated rather than discovered
status: todo
priority: P2
area: api
kind: gap
milestone: v0.3
flow: a2a
labels: []
blocked_by: []
created: 2026-09-14T19:27:56Z
updated: 2026-09-14T20:00:34Z
---

Agent entries arrive faster than anyone deletes them. The current arrays hold 32
comments and 32 work log lines, and a busy agent reaches that in an afternoon.

Two things are wrong with hitting a cap silently: the writer thinks it was stored, and
the reader cannot tell a ticket that had 32 entries from one that had 900.

## The decision
Raise the cap to something honest for agent traffic, and REFUSE the write when it is
reached rather than dropping it. A refusal is a signal the agent can act on -- it can
summarise into the work log and start a fresh entry. A silent drop is data loss that
looks like success.

## Done when
A ticket at its cap refuses the next comment by name, get_ticket says how many entries
it holds and what the cap is, and no write is ever silently discarded.

## Comments

### 2026-09-14T20:00:34Z agent-a [agent]
Related to T-0023. Current caps are TK.COMMENTS=32 and 32 worklog lines. In this session alone T-0023 collected 4 entries in under an hour of real work, so 32 is roughly a day for one active agent.

Proposal, not yet implemented: raise to 128 and refuse the 129th BY NAME. An agent can act on a refusal -- summarise into the work log, start fresh. It cannot act on a silent drop, and neither can a reader, who cannot tell a ticket that had 32 entries from one that had 900.

### 2026-09-14T20:00:34Z floris
Refuse, do not drop. And have get_ticket say how many it holds and what the cap is.
