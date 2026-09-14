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
