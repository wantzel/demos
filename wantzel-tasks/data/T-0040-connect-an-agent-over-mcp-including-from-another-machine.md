---
id: T-0040
title: Connect an agent over MCP, including from another machine
status: todo
priority: P1
area: docs
kind: gap
milestone: v0.3
flow: h2a
labels: []
blocked_by: []
created: 2026-09-14T20:01:57Z
updated: 2026-09-14T20:01:57Z
---

There is nothing in docs/ that tells you how to actually point Claude, Codex or Cursor at
this. That is the first thing someone forking it will try.

## Two cases
**On this machine**: `./wztrun --stdio` and a stdio entry in the client's config. No port,
no network.

**From elsewhere** (a hosted client, a phone, a colleague): the server has to be reachable
over HTTPS with a valid certificate, which means a tunnel. Cloudflare named tunnel is the
one to document -- free, a fixed hostname on your own domain, real certificate. Tailscale
Funnel as the fallback when you do not want to move DNS.

A quick tunnel with a random hostname is fine for a five-minute test and wrong for a
connector you want to keep, because the URL changes every run.

## Done when
Someone who cloned this can get their own agent talking to it, both ways, from the doc.
