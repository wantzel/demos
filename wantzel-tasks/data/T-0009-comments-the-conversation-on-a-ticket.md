---
id: T-0009
title: Comments: the conversation on a ticket
status: done
priority: P0
area: api
kind: gap
milestone: v0.2
labels: [decision]
blocked_by: []
created: 2026-09-14T19:11:59Z
updated: 2026-09-14T19:21:25Z
---

A ticket without a conversation is a form, not a ticket. Most of what a team knows
about a problem is in what people said while working on it.

## Shape
Append-only, each with an author and a timestamp. Nothing is edited or deleted --
a conversation you can rewrite is not a record of what happened.

## In the file
Under a `## Comments` heading in the body, one block per comment:

    ### 2026-09-14T19:30:00Z floris
    The cap was there, the answer did not mention it.

That keeps the whole ticket in one readable file, which is the point of the storage
choice -- a comment thread in a side table would break it.

## Tools
add_comment(id, author, text) and the comments come back on get_ticket.

## Done when
A comment added over MCP is readable with `cat`, and a comment typed into the file
by hand comes back over REST.

## Work log
- 2026-09-14 - comments append-only under ## Comments in the file; round-trip verified after a restart
