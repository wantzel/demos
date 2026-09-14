# 2. One declaration, three interfaces

`src/schema.wz` is the only file that describes the API. Everything that reads or writes
a ticket over MCP, REST or the tool listing is generated from it — not hand-written to
match it, generated, by the compiler, from this:

```pascal
tools
  create_ticket(CreateArgs): TicketOne  "Create a ticket. Returns it with the id the server assigned.";
  get_ticket(IdArgs): TicketOne         "One ticket by id." readonly idempotent;
  list_tickets(ListArgs): TicketList    "Tickets matching a filter, newest first. Every filter is optional." readonly;
  update_ticket(UpdateArgs): TicketOne  "Change a ticket. Send only the fields that change; the rest keep their value." idempotent;
  delete_ticket(IdArgs): TicketOne      "Delete a ticket. Returns the ticket as it was." idempotent;
  ticket_stats(StatsArgs): Stats        "How many tickets per status, for a board header." readonly idempotent;
  add_comment(CommentArgs): TicketOne   "Say something on a ticket. Comments are append-only: nothing is edited or removed.";
  log_work(LogArgs): TicketOne          "Record a dated fact on a ticket -- what was found, decided or measured. Not a message to someone, a record for whoever reads this next.";
end;
```

Eight lines, one per tool: a name, the argument shape, the result shape, a description,
and two flags. From this the compiler builds, by name:

- `tool.list` — the complete `tools/list` text MCP expects: every tool's name,
  description, `inputSchema` and `outputSchema` as JSON Schema, generated from the
  `schema` records the tools refer to.
- `tool.byname` and `tool.run` — look a tool up by the bytes of its name, then parse the
  JSON arguments against its schema, call the handler, and serialize the result. Bad
  arguments never reach your code: `tool.run` returns `-1` before your function is
  called.
- `tool.in_<name>` and `tool.out_<name>` — the argument and result records themselves,
  with a `_n`/`_ok`/`_null` triple per optional field (more on that in a moment).
- a `readonly`/`idempotent`/`destructive` flag per tool, carried into the MCP
  annotations, so a caller — or an agent — can tell that `get_ticket` is safe to retry
  after a dropped connection and `delete_ticket` is not something to guess at twice.

What you write by hand is the handler: one function per tool, taking the parsed
arguments and an empty result to fill in. `src/tickets.wz` has the eight of them for
this project; `tool.create_ticket` is a representative one — it checks that a title was
given, applies the defaults for a new ticket (`todo`, `P2`, `general`), validates any
priority or kind that *was* given, and writes the file. No argument parsing, no JSON, no
routing: those never appear in that file, because none of them is hand-written.

## What "optional" means to a generated parser

A `schema` field marked `?` does not just become nullable — it becomes two extra facts
the handler can ask about. `CreateArgs.priority` is declared `text[2]?`, which the
handler sees as `priority` (the value, if any), `priority_ok` (was this field present in
the call at all?) and `priority_null` (was it present and explicitly `null`?). That
three-way split is what lets `update_ticket` mean "change nothing you didn't mention"
without a separate `patch` endpoint: `tool.update_ticket` in `src/tickets.wz` checks
`a[0].kind_ok` before touching the field at all, and inside that, `a[0].kind_null` to
tell "clear this" apart from "set it to this value". One call shape, one way to update a
ticket, and the schema is what makes the distinction possible instead of something the
handler has to invent.

## Three doors, one line each

`src/main.wz` has exactly one routing function, `app.request`, and it is short on
purpose:

```pascal
procedure app.request;
begin
  if tool.rest("/api/") then return;
  if http.pathis("/mcp") then begin mcp.http; return; end;
  if router.get("/tools.json") then begin http.add(tool.list); http.finish(200, "application/json"); return; end;
  if router.get("/") then begin ui.page; return; end;
  ...
end;
```

`tool.rest("/api/")` is REST for every tool at once: it reads the path after `/api/`,
looks the name up with `tool.byname`, parses the body as that tool's arguments, and
writes the JSON result — one line, and the whole REST surface exists because the tool
table does. `mcp.http` is the same dispatch reached through an MCP envelope instead of a
bare path. `/tools.json` just serves `tool.list` — the same text MCP's `tools/list`
returns, so a REST client can discover the API by reading it, without a separate
OpenAPI document to keep in sync. Only `GET /` is genuinely this application's own code:
the board and the list, which is what [4. The UI](04-the-ui.md) is about.

Four routes, three of which are generated glue, is the whole interface layer of a
service with a REST API, an MCP server and a JSON Schema per tool. What is left to write
by hand is the shapes in `schema.wz` and the eight functions that decide what happens —
nothing about carrying them over the wire.

## The include order, and why it is not decoration

`main.wz` includes in this order:

```pascal
include "schema.wz";    // the shapes and the tools block
include "tickets.wz";   // the handlers: tool.create_ticket, tool.get_ticket, ...
include "query.wz";     // tool.list_tickets, tool.ticket_stats
include "ui.wz";

include "tools.wz";     // lib/tools.wz -- builds the dispatch from what now exists
```

`lib/tools.wz` is a library file, generic across any program that declares a `tools`
block; it defines `app.call` and `tool.rest`, which need `tool.byname`, `tool.run` and
every `tool.<name>` handler to already be declared. Include it before the `tools` block
or before the handlers, and the compiler reports errors in generated code — inside
`lib/tools.wz`, at a line number that does not correspond to anything you wrote,
complaining about an identifier that does not exist yet. The fix is the order above:
schema and tools block first, then the handlers that implement each tool, then
`lib/tools.wz` last, once everything it needs to wire together actually exists.

Next: [3. Storage](03-storage.md).
