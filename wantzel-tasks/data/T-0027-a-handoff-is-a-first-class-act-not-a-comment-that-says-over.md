---
id: T-0027
title: A handoff is a first-class act, not a comment that says "over to you"
status: todo
priority: P2
area: api
kind: gap
milestone: v0.3
flow: a2a
labels: []
blocked_by: []
created: 2026-09-14T19:27:56Z
updated: 2026-09-14T19:27:56Z
---

When an agent finishes its part and passes the ticket on, three things change together:
who holds it, which direction it is now going (`flow`), and what the next party needs
to know. Done as three separate calls they can half-happen, and a ticket assigned to
nobody with a flow that still says a2a is a ticket that no one and nothing will pick up.

## The decision
`handoff(id, to, flow, note)` -- one call, all four or none. The note is a comment with
audience `agent` when handing to an agent and `human` when handing to a person, because
the register follows the recipient.

## Done when
One call moves assignee, flow and adds the note, and a handoff to a person produces a
ticket that reads correctly in the clean view.
