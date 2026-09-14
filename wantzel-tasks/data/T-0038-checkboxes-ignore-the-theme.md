---
id: T-0038
title: Checkboxes ignore the theme
status: done
priority: P2
area: ui
kind: bug
milestone: v0.2
flow: a2h
labels: []
blocked_by: []
created: 2026-09-14T19:58:49Z
updated: 2026-09-14T19:58:49Z
---

Found by looking at the dark screenshot: the two `for agents` checkboxes render as white
squares. A checkbox keeps the browser's own colours unless told otherwise, so it was the
one control on the page that ignored the theme.

One line: `accent-color: var(--accent)`.

## The lesson worth keeping
It was invisible in every test and in the light screenshot. Rendering both themes and
LOOKING is a separate check from anything a test suite can do.
