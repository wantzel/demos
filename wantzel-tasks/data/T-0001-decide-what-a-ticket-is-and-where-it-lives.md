---
id: T-0001
title: Decide what a ticket is, and where it lives
status: done
priority: P0
area: docs
kind: doc
milestone: v0.1
labels: [decision]
blocked_by: []
created: 2026-09-14T19:08:56Z
updated: 2026-09-14T19:11:59Z
---

The first decision, and the one everything else rests on.

A directory of markdown files, one per ticket: frontmatter for the fields, the body
for the story. You can read a ticket with `cat`, edit one in an editor, and diff the
directory in git.

## What it cost
The first version used fixed-size records in an append-only log. Faster, and wrong
here: you cannot read your own data, a diff means nothing, and a new field means a
new record format.

## Done when
A file written by hand in an editor round-trips through the server with every field
intact.
