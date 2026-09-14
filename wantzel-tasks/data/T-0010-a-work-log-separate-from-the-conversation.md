---
id: T-0010
title: A work log, separate from the conversation
status: done
priority: P1
area: api
kind: gap
milestone: v0.2
labels: []
blocked_by: []
created: 2026-09-14T19:11:59Z
updated: 2026-09-14T19:21:25Z
---

Two different things get confused if they share a field: what someone SAID, and what
was FOUND or DECIDED.

A comment is a message to other people. A work log line is a dated fact: measured X,
chose Y because Z, this approach failed for this reason. The second is what makes a
ticket readable a month later by someone who was not there -- and it is the part a
status field can never carry.

## Done when
log_work(id, text) appends a dated line under `## Work log`, and it is obvious in the
file which lines are conversation and which are record.

## Work log
- 2026-09-14 - work log is a dated line under ## Work log, separate from the conversation
