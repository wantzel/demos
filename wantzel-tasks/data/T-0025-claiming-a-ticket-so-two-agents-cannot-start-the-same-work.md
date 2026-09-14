---
id: T-0025
title: Claiming a ticket, so two agents cannot start the same work
status: done
priority: P0
area: api
kind: gap
milestone: v0.3
flow: a2a
labels: [decision]
blocked_by: []
created: 2026-09-14T19:27:56Z
updated: 2026-09-14T19:38:58Z
---

Two agents reading the same backlog will pick the same top ticket, because they are
looking at the same order and they are both right. With people this resolves itself in
a standup; with agents it is two hours of duplicated work discovered at merge time.

## The decision
A conditional write. `claim_ticket(id, who)` sets assignee and status in ONE call, and
refuses if the ticket already has an assignee. The refusal is the useful part: the
second agent learns immediately and picks the next one, rather than finding out later.

`update_ticket` cannot do this. Read-then-write has a gap between the read and the
write, and that gap is exactly where the two agents both decide to go.

## Also needed
`release_ticket(id)`, because an agent that dies holding a claim has taken the ticket
out of the backlog for everyone, and nothing else can give it back.

## Done when
Two claims on one ticket: the first is accepted, the second is refused by name, and the
ticket is assigned to the first. A released ticket is claimable again.

## Work log
- [agent] 2026-09-14 - conditional write; second claim refused by name, same holder idempotent
