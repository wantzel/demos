---
id: T-0026
title: next_ticket: one call that answers "what should I pick up?"
status: done
priority: P1
area: api
kind: gap
milestone: v0.3
flow: a2a
labels: []
blocked_by: []
created: 2026-09-14T19:27:56Z
updated: 2026-09-14T19:38:58Z
---

An agent starting work has to do this today: list every ticket, filter for todo, sort
by priority, drop the ones that are assigned, drop the ones whose blockers are open,
take the first. Five steps of client-side logic that every agent has to get right, and
each one gets it slightly differently.

## The decision
`next_ticket(who, flow?)` returns the single ticket that agent should start, or nothing
if there is none. The ordering rule lives on the server, so every caller agrees about
what "next" means.

## The order
1. not done, not assigned to someone else
2. nothing unfinished blocking it
3. highest priority first
4. oldest first inside a priority -- a backlog that reorders itself under an agent is
   a backlog that starves its own oldest work

## Done when
next_ticket skips assigned and blocked tickets, prefers P0 over P2, and returns an
empty answer rather than an error when there is genuinely nothing to do -- "nothing to
do" is a normal state, not a failure.

## Work log
- [agent] 2026-09-14 - found:false carries "nothing to do" as a normal answer, not an error
