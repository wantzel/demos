# 1. What a ticket is, and why it is a file

This is the first of a series written while building, not afterwards. Each part explains
one decision and what it cost, so you can follow the reasoning rather than only the result.

## A directory of markdown files, not a database

Every ticket is one file:

```
data/T-0001-the-list-must-say-when-it-capped.md
```

Frontmatter carries the fields, the body carries the story:

```markdown
---
id: T-0001
title: The list must say when it capped
status: doing
priority: P1
area: api
kind: bug
assignee: floris
labels: [good-first-issue]
blocked_by: []
created: 2026-09-14T18:55:01Z
updated: 2026-09-14T19:02:44Z
---

## Goal
A list that silently stops at fifty looks exactly like a list that found fifty,
and the caller acts on the wrong one.

## Work log
- 2026-09-14 — measured: the cap was there, the answer did not mention it.
```

### Why not a database

The first version of this demo used `lib/store.wz`: fixed-size records, an append-only log
and a snapshot. It worked and it was fast. It was also the wrong choice here, for reasons
that only become obvious once you try to live with it:

- **You cannot read your own data.** `cat` gives you bytes. Every question about what is in
  there has to go through the server.
- **A diff is meaningless.** The log is binary, so version control can store it but not
  show you what changed. For a ticket system that is most of the value.
- **A new field is a new record format.** Fixed-size records mean the layout is the
  contract; adding `estimate` means old files no longer load.

A file per ticket gives up speed at scale and gains all of that back. The honest trade is
in [03-storage.md](03-storage.md).

### What we learned from running one

This format is not invented here — it is the one we use ourselves, and a few details in it
are the result of getting them wrong first:

**`area` and `kind` are two fields, not one.** `area` is *where* the work sits (api, ui,
docs); `kind` is *what kind of work* it is (bug, gap, chore, research, doc). Collapsing
them into a single "type" made the question *"which bugs are open?"* unanswerable without
reading every ticket, because `area: api` holds a crash and a missing feature alike.

**The work log is append-only prose, not a status field.** Each line is dated and says what
was found, decided or measured. A ticket is read by whoever picks it up next — possibly
weeks later, possibly not the person who wrote it — and "what did we already try?" is the
question a status field cannot answer.

**A ticket is never done because it looks done.** In our own system a ticket names its
tests, and closing one runs them. That is out of scope here, but the shape it enforces is
not: the body says what *done* looks like, in the ticket, before the work starts.

**The filename carries the title.** `T-0001-the-list-must-say-when-it-capped.md` is
greppable and readable in a file listing, and the id at the front keeps it sortable. The
title in the name is a copy of the title in the frontmatter; the frontmatter wins, and
renaming is the server's job.

## What this buys the demo

The point of this demo is to show what it takes to write a service like this. Storage you
can read with `cat` and diff in git is part of that: nothing here is hidden behind a format
only the binary understands.

Next: [2. One declaration, three interfaces](02-one-declaration-three-interfaces.md).
