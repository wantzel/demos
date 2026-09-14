---
id: T-0021
title: Claiming a ticket, so two agents do not take the same one
status: done
priority: P1
area: api
kind: gap
milestone: v0.2
flow: a2a
labels: []
blocked_by: []
created: 2026-09-14T19:23:43Z
updated: 2026-09-14T19:47:50Z
---

Ten agents reading the same backlog pick the same top ticket. The cost is two of
them doing the work and one of them wasting it.

## The smallest thing that works
claim_ticket(id, who) sets assignee and status doing, but ONLY if the ticket is still
todo and unassigned. Otherwise refused, and the agent that lost asks for the next one.
No lock, no lease, no timeout: one conditional write.

## Deliberately not
A lease with an expiry. That needs a clock nobody agrees on and a story for what
happens when it lapses mid-edit.

## Work log
- 2026-09-14 - superseded by T-0025, which states the same feature as a conditional write and was the one built
