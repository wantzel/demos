---
id: T-0006
title: A web UI on the same port
status: done
priority: P0
area: ui
kind: gap
milestone: v0.1
labels: [ui]
blocked_by: []
created: 2026-09-14T19:08:56Z
updated: 2026-09-14T19:21:25Z
---

The board in a browser: columns per status, a filter, and creating or editing a
ticket without leaving the page.

## The constraint that makes it interesting
One page, carried inside the binary. No build step, no bundler, no node_modules --
if the demo needed a frontend toolchain to show a service with no dependencies, it
would be arguing against itself.

## Done when
It looks fresh, it feels snappy, and it runs from the same binary on the same port.

## Work log
- 2026-09-14 - board and list both built; drag calls update_ticket, no private route for the page
