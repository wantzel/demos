---
id: T-0015
title: An HTML page about this project, generated from the source
status: doing
priority: P2
area: docs
kind: chore
milestone: v0.2
labels: [docs]
blocked_by: []
created: 2026-09-14T19:11:59Z
updated: 2026-09-14T20:00:34Z
---

docs/ becomes HTML about this project: what it is, how the three interfaces come from
one declaration, and how to build something like it.

## The constraint
Generated from what is actually in the source, not written beside it. Documentation
that repeats a declaration by hand is documentation that goes stale on the first
change -- and the tool table is already machine-readable at /tools.json.

## Work log
- 2026-09-14 - docs/ becomes HTML with diagrams, same visual language as the website

## Comments

### 2026-09-14T20:00:34Z floris
docs/ should become HTML, with visuals in the same style as the website.

### 2026-09-14T20:00:34Z agent-docs [agent]
Constraint from the ticket: generated from what is in the source, not written beside it. /tools.json is already machine-readable and now valid JSON (T-0031 sibling fix), so the tool table can be rendered rather than retyped.

For the diagrams: the house style is inline SVG only, theme variables, no external requests -- same rule the page itself follows.
