---
id: T-0029
title: Frontend in real files, not escaped strings
status: done
priority: P1
area: ui
kind: chore
milestone: v0.3
flow: h2a
labels: [decision]
blocked_by: []
created: 2026-09-14T19:41:00Z
updated: 2026-09-14T19:38:58Z
---

The frontend is currently CSS, HTML and JavaScript inside Wantzel string literals -- 268
calls to http.add, each with its quotes escaped. That is how web applications were written
twenty years ago, and it is the weakest-looking part of a project whose whole argument is
"read this and see how clean it can be".

The escaping is the real damage. You cannot read the HTML, no editor will highlight it,
and changing a CSS rule means counting backslashes.

## What must not change

The promise is ONE binary with no dependencies and nothing to install. Serving the files
from disk at run time would break it: the binary would stop working the moment it was moved
without its directory. So the assets are EMBEDDED at build time, not read at run time.

## The decision

Three real files under web/ -- app.css, app.html, app.js -- and a small generator that
turns them into a Wantzel source file of string constants, run as the first step of the
build:

    web/app.css  ->
    web/app.html ->   wzgen   ->   src/assets.wz   ->   compiled into the binary
    web/app.js   ->

The generator is written in Wantzel, like every other tool in a Wantzel project. src/ui.wz
keeps only what is genuinely program: deciding what to serve, and the routing.

## Why not a template language

Because then the demo shows you a template language instead of showing you Wantzel. The
page is static and the data arrives over the same REST API an agent uses, so there is
nothing to interpolate.

## Done when

web/ holds three files an editor understands, the generated file is reproducible from them,
ui.wz no longer contains escaped HTML, the binary still has no run-time dependency on any
file, and the page is byte-identical to what it serves today.

## Work log
- [agent] 2026-09-14 - 351 lines of escaped strings became 34; web/ is real css, html and js
