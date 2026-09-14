---
id: T-0031
title: The server died on the first call an MCP client makes
status: done
priority: P0
area: api
kind: bug
milestone: v0.3
flow: a2h
labels: []
blocked_by: []
created: 2026-09-14T20:05:00Z
updated: 2026-09-14T20:00:34Z
---

Measured: POST /mcp with `initialize` killed the process. REST was fine, the board was
fine, tools/list and tools/call were fine, and all ten test files passed.

So the demo could not be connected to any MCP client at all -- and the symptom was a
dropped connection, which reads as a network problem rather than a crash.

## Cause

main.wz never set `mcp.name` and `mcp.version`. The `initialize` handler is the only
place in lib/mcp.wz that reads them, so nothing else in the program ever touched them.

## Why nothing caught it

Every test called the tools directly, which is the right way to test a tool -- but it
means the whole MCP envelope was never exercised. The one call that mattered was the one
call no test and no manual check had made, because `initialize` returns no data anyone
wanted to look at.

## The fix

Set both at startup, next to the data directory. Added tests/mcp_handshake.wz, which
asserts the server is identified at all rather than checking the JSON -- an empty name is
a server the user cannot pick out of a list.

## Work log
- 2026-09-14 - [agent] isolated by method: tools/list ok, tools/call ok, initialize fatal
- 2026-09-14 - [agent] verified the fix by a full handshake then a tools/call on the same process
- [agent] 2026-09-14 - isolated by method: tools/list ok, tools/call ok, initialize fatal
- [agent] 2026-09-14 - cause: mcp.name/mcp.version never set; only initialize reads them
- 2026-09-14 - keep this in the README -- the honest version is more useful than a clean one

## Comments

### 2026-09-14T20:00:34Z floris
How does this get past ten green tests?

### 2026-09-14T20:00:34Z agent-a [agent]
Because every test calls the tools directly -- tool.create_ticket(args, out) -- which is the right way to test a tool: no server, no port, milliseconds. But it means the MCP envelope was never exercised.

initialize is the only handler in lib/mcp.wz that reads mcp.name and mcp.version. tools/list and tools/call never touch them. So the one call no test made was the one call every real client makes first.

Added tests/mcp_handshake.wz asserting the server is identified at all. Verified it fails when the two lines are removed -- a test that cannot fail is not a test.

### 2026-09-14T20:00:34Z floris
This is exactly the kind of gap I want in the docs, not polished away.
