---
id: T-0046
title: A refused create still consumed an id
status: done
priority: P1
area: api
kind: bug
milestone: v0.3
flow: a2h
labels: []
blocked_by: []
created: 2026-09-14T20:50:00Z
updated: 2026-09-14T20:50:00Z
---

Found by watching a real client work: T-0043 was created at 20:25, T-0045 at 20:44, and
T-0044 does not exist and never will.

What exactly the client sent on the attempt that consumed T-0044 is not recorded -- the
server does not log refusals -- so the trigger is unknown. The mechanism is not: it is
reproducible on demand, below.

## Cause

`create_ticket` took the next id and incremented the counter BEFORE validating priority,
kind and flow. A create refused for a bad value therefore burned an id on its way out.

Reproduced directly:

    POST /api/create_ticket {"title":"probe","kind":"feature"}
      -> {"detail":"kind must be bug, gap, chore, research or doc"}
    POST /api/create_ticket {"title":"probe after refusal"}
      -> T-0047          (T-0046 was consumed by the refusal)

## Why it matters more for agents than for people

A person who mistypes a field fixes it and moves on. An agent retries, and every retry
costs an id -- so a client that gets a field wrong three times leaves three holes. And a
missing number reads as a DELETED ticket to whoever looks later, which is a different and
more alarming thing than one that was never created.

## The fix

Everything that can be refused is now checked before an id is taken. The later checks are
left in place as harmless duplicates; they can no longer fire.

tests/create.wz covers it: a refused create, then a valid one, and the id must be the next
in sequence. Verified that the test fails when the fix is removed.

## Work log
- 2026-09-14 - noticed a hole in the numbering between two real client calls (T-0044)
- 2026-09-14 - [agent] reproduced against the live API; the gap is deterministic
- 2026-09-14 - validation moved ahead of id allocation; regression test added and proven
