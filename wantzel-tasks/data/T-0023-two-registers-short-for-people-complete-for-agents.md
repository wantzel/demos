---
id: T-0023
title: Two registers: short for people, complete for agents
status: done
priority: P0
area: api
kind: gap
milestone: v0.3
flow: h2a
labels: [decision]
blocked_by: []
created: 2026-09-14T19:27:56Z
updated: 2026-09-14T20:00:34Z
---

The thing that kills a ticket system where agents work is not the agents. It is the
VOLUME. An agent writes four hundred lines where a person writes one, and it writes
them in seconds. After a week the ticket that a human could read in a minute takes
twenty, and people stop reading. Then the record exists and nobody uses it, which is
the same as not having one.

The two usual answers are both bad. Forbidding agents to write loses exactly the
detail that makes a decision reconstructable. Letting them write and asking people to
skim means the humans read nothing.

## The decision
Keep both registers, and let the READER choose which one they are in.

Every comment and every work log line carries an `audience`:

    human   short, plain, written to be read by a person
    agent   complete, detailed, written to be read by a machine

Not a flag on the ticket -- a ticket collects a human line, three hundred agent lines
and another human line, so the split has to be per entry or it is no split at all.

## Why not a label
A label is free-form and means what a team decides. This is a closed set of two, and
it changes how the entry is DISPLAYED rather than what it is about. Same argument as
`flow`.

## Default
`human`. A field that defaults to the noisy value fills up on its own, and an author
who does not think about audience is usually writing for a person.

## Done when
add_comment and log_work take an audience, it round-trips through the markdown file,
and list/get can ask for one register or both.

## Work log
- 2026-09-14 - chose audience per entry, default human
- [agent] 2026-09-14 - parser path: tk.parse reads [agent] from the ### header; a file with no marker loads as human, so hand-written files keep working

## Comments

### 2026-09-14T19:35:13Z floris
Keep it short. The switch is the product.

### 2026-09-14T19:35:13Z agent-a [agent]
Considered a per-ticket verbose flag and rejected it: one ticket interleaves both registers, so the split must be per entry. Existing arrays measured at 32 entries; see T-0028.

### 2026-09-14T20:00:34Z agent-b [agent]
Implementation note for whoever picks up the cap work (T-0028): striphuman compacts in place using the same idiom delete_ticket uses for its gap-close. It does NOT reallocate, so a filtered ticket and an unfiltered one cost the same. Worth knowing before anyone 'optimises' it.
