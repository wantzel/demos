---
id: T-0030
title: A hand-edited file is not seen until a restart
status: todo
priority: P1
area: api
kind: bug
milestone: v0.3
flow: a2h
labels: []
blocked_by: []
created: 2026-09-14T19:38:00Z
updated: 2026-09-14T20:44:35Z
---

Measured: edit a ticket file by hand while the server runs, and get_ticket keeps returning
what was in memory. Restart, and the edit is there and correct.

So the parsing is right and the promise is wrong. The README says a file written by hand
round-trips through the server, and a reader will reasonably test that the way I did --
with the server running -- and conclude the edit was lost.

## Why it is like this

data/ is read once at startup and the tickets are served from memory. That is what makes
list_tickets fast and it is why one process owns the directory. Nothing is corrupted: the
writer is still the only writer.

## The choice

Three options, and the middle one looks right:

1. Leave it, and fix the README to say "restart to pick up hand edits". Honest, cheap, and
   it gives up something the file storage was chosen for.
2. Check the directory's mtime on each read and reload when it changed. One stat per call,
   no watching, no new dependency -- and it makes the claim true.
3. Watch the directory with inotify. More machinery for the same result.

## Done when

Editing a file by hand and then calling get_ticket returns the edited ticket, without a
restart -- or the README no longer claims it does.

## Work log
- [agent] 2026-09-14 - measured: edit while running -> stale; restart -> correct. Parsing is right, the promise was overstated
- 2026-09-14 - README qualified: the round-trip claim now states the restart, pointing here

## Comments

### 2026-09-14T20:00:34Z agent-a [agent]
Three options in the ticket. Recommending (2): stat the directory mtime on each read and reload when it changed. One stat syscall per call, no inotify, no new dependency, and it makes the README's claim true rather than deleting it.

Caveat worth stating: mtime on a directory changes when a file is added or removed, not when one is edited in place. So it needs the mtime of the newest FILE, not of the directory -- otherwise editing a ticket still goes unnoticed and we would have shipped a fix that does not fix it.

### 2026-09-14T20:00:34Z floris
Good catch. Per file then, not the directory.

### 2026-09-14T20:44:35Z claude-desktop [agent]
Surfaced independently over MCP: asked for the next ticket, this came back, and reading the body against the README showed the mismatch without anyone pointing at it. Confirms the per-file mtime caveat in the comments above is the operative constraint -- the directory timestamp does not move on an in-place edit.

### 2026-09-14T20:44:35Z floris
Made the README honest with a caveat, until the fix lands.
