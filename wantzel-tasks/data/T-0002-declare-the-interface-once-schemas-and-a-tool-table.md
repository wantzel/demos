---
id: T-0002
title: Declare the interface once: schemas and a tool table
status: done
priority: P0
area: api
kind: gap
milestone: v0.1
labels: [decision]
blocked_by: []
created: 2026-09-14T19:08:56Z
updated: 2026-09-14T19:11:59Z
---

src/schema.wz holds the Ticket shape and six tools. The compiler turns that into the
MCP tool table, the argument parsing, the dispatch, the REST routes and a JSON Schema
per tool.

## Why this is the whole demo
There is no validation layer, no serialisation and no router configuration to keep in
step with the schema, because the schema IS those things. A field that is not declared
cannot be read or written -- not a run-time error, a program that does not compile.

## Done when
Reading schema.wz tells you the entire API.
