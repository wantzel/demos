---
id: T-0024
title: One switch in the top bar that gives you your clean tickets back
status: done
priority: P0
area: ui
kind: gap
milestone: v0.3
flow: h2a
labels: []
blocked_by: []
created: 2026-09-14T19:27:56Z
updated: 2026-09-14T19:38:58Z
---

The two registers are only worth having if turning one off is one action, in the place
you already are. A per-ticket setting is not that: by the time you have set it on the
fourth ticket you have read three noisy ones.

## The decision
One toggle in the top bar, next to board/list. It applies everywhere at once -- the
cards, the list, the open ticket -- and it is remembered, so a person who wants clean
tickets sets it once and never again.

Two positions, not three:

    clean      only what was written for people
    everything  both registers, agent entries visibly marked as such

## What it must not do
It must not hide that something was hidden. A ticket with eleven folded agent entries
says so, with a count you can click. Silently dropping content teaches people that the
clean view is lying to them, and then they stop using it -- which is the failure this
whole feature exists to prevent.

## Done when
The switch flips every view at once, survives a reload, and a hidden entry is always
announced by a count rather than simply gone.

## Work log
- [agent] 2026-09-14 - switch remembered in localStorage; hidden entries always counted, never dropped
