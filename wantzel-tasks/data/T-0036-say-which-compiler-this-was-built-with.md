---
id: T-0036
title: Say which compiler this was built with
status: done
priority: P1
area: docs
kind: chore
milestone: v0.2
flow: h2a
labels: [decision]
blocked_by: []
created: 2026-09-14T19:58:49Z
updated: 2026-09-14T19:58:49Z
---

Wantzel is before 1.0 and the language still moves. A demo that does not say which
compiler it needs is a demo that will one day fail to build for a reason nobody can see.

## The decision
The version in the README, and a check in `wztrun` and `wzttest` that prints a note on a
mismatch. A NOTE, not a refusal: a newer compiler usually works, and the honest way to
find out is to try.

## Done when
Building with a different compiler says so, once, and continues.
