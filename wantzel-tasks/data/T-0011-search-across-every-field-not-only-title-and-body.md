---
id: T-0011
title: Search across every field, not only title and body
status: done
priority: P1
area: api
kind: gap
milestone: v0.2
labels: [good-first-issue]
blocked_by: []
created: 2026-09-14T19:11:59Z
updated: 2026-09-14T19:47:50Z
---

`query` currently looks in the title and the body. Someone searching for a person, a
label or a milestone gets nothing, which reads as "not found" rather than "not
searched" -- and that is the expensive kind of wrong answer.

## Done when
A query matches the title, body, assignee, milestone, labels and id, and the answer
says nothing about where it matched: one search box, one meaning.

## Work log
- 2026-09-14 - measured: q.match already searches title, body, id, assignee, milestone, area, labels and comments -- the ticket was stale, not the code
