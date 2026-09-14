---
id: T-0007
title: A test per feature, each in its own .wz file
status: done
priority: P1
area: tests
kind: chore
milestone: v0.1
labels: [good-first-issue]
blocked_by: []
created: 2026-09-14T19:08:56Z
updated: 2026-09-14T19:47:50Z
---

A test is a program that calls the tools directly: no server, no port, no client, and
the compiler is the first thing that judges it -- a test that does not compile is a
failing test.

## Done when
create, get, update, delete, list filtering and stats each have their own file in
tests/, and ./wzttest runs them all.

## Work log
- 2026-09-14 - 10 test files, ~170 checks, one per tool; all 11 declared tools are exercised
