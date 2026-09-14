# 3. Storage: a directory of markdown files

There is no database. `src/tickets_store.wz` reads and writes one file per ticket in a
directory, and that directory — `data/` by default — is the entire persistence layer.

## A real file

This is `data/T-0004-a-list-must-say-when-it-capped.md`, unedited:

```markdown
---
id: T-0004
title: A list must say when it capped
status: done
priority: P0
area: api
kind: bug
milestone: v0.1
labels: [good-first-issue]
blocked_by: []
created: 2026-09-14T19:08:56Z
updated: 2026-09-14T19:11:59Z
---

A list that silently stops at fifty looks exactly like a list that found fifty, and
the caller acts on the wrong one.

## Done when
The answer carries returned, matched and truncated, and a test proves the three
disagree when the cap bites.

## Work log
- Two real bugs surfaced while testing this: an id built with its padding in the
  wrong place (trailing NUL bytes, so it sorted last), and an insertion that
  conflated "not full yet" with "beats the smallest kept value". Both caught by
  tests/list_order.wz, which calls the tools directly with no server running.
```

Frontmatter between `---` lines carries the fixed fields — the ones declared on the
`Ticket` schema in `schema.wz`. Everything after it is markdown: the body, and whatever
headings the body happens to contain.

## The honest trade-off

What this buys you, and what it costs, both follow directly from "it's a file":

- **You can read it with `cat`.** No query, no client, no running server. What is in the
  ticket is what is in the file, in the format you are looking at right now.
- **A diff is meaningful.** Change a ticket's status and `git diff` shows exactly that
  one line changing on that one file — which is most of what makes a ticket system
  usable inside version control at all.
- **You can edit it by hand.** Open the file, change a line, save it. The server picks
  it up the next time it starts, because reading a ticket back is the same parser the
  server itself uses.
- **Listing gets slower as the directory grows.** `tk.loadall` in
  `tickets_store.wz` reads and parses every file in the directory at startup, and
  `tool.list_tickets` walks every loaded row on every call — there is no index. The
  comment at the top of `query.wz` states the trade-off plainly: a few thousand rows is
  milliseconds, and the moment a measurement says otherwise is when an index is worth
  adding, not before.
- **One process writes.** Every ticket lives in memory after startup (`tk.all`), and
  a write updates the file and that in-memory copy together. A second process pointed
  at the same directory would have its own copy, and the first write from either side to
  go stale would silently overwrite the other's without a lock — so this format needs a
  single writer, permanently, not just for now.

## What survives a hand edit

Reading a ticket back is `tk.parse` in `tickets_store.wz`, and it is written to be
forgiving in one specific way: an unknown key in the frontmatter or an unknown `##`
heading in the body does not fail the parse, and does not get dropped. `tk.readbody`
only treats `## Work log` and `## Comments` as sections with their own meaning — a
dated line under the first, a `### <timestamp> <author>` entry under the second.
Anything else, including a `## Done when` heading someone adds by hand (as in the file
above), stays exactly where it is, as part of the body. The next time the server writes
that ticket back out, that heading is still there, because it was never parsed out of
the body in the first place — it was never recognized as anything other than body text.

This is a deliberate asymmetry: the server has a fixed, small vocabulary of things it
understands structurally (the frontmatter fields, the two special headings), and
everything else round-trips as opaque text rather than being rejected or silently
discarded. A ticket someone extended by hand keeps what they added.

## What it will not do

There is no migration story for the frontmatter format itself, and no partial write: `
tk.write` builds the whole file in one buffer and writes it in a single call, so a crash
mid-write leaves either the old file or the new one, never a half-written mix — but there
is also no transaction spanning multiple files. A changed title changes the filename
(the `id-slug.md` pattern), and `tool.update_ticket` writes the new file before removing
the old one, in that order, so a failure between the two leaves the ticket present under
its new name rather than gone.

Next: [4. The UI](04-the-ui.md).
