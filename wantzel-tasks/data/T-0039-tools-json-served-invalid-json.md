---
id: T-0039
title: /tools.json served invalid JSON
status: done
priority: P0
area: api
kind: bug
milestone: v0.2
flow: a2h
labels: [decision]
blocked_by: []
created: 2026-09-14T20:01:57Z
updated: 2026-09-14T20:01:57Z
---

Measured: `GET /tools.json` returned `{...},{...}` -- bare concatenated objects with no
wrapping array. Any client fetching it to discover the API got "extra data after the
first object" from its JSON parser.

## Cause
`tool.list` is the generated table as bare ENTRIES, which is exactly the shape MCP wants
inside its own envelope -- and exactly what a plain GET must not return. The route wrote
it out raw.

## The lesson, which is narrow and worth keeping
A value shaped for one transport is not automatically a document for another.

## Done when
It parses, and a test proves the table is bare so the wrapper cannot be dropped again.
