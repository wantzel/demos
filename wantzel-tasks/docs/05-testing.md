# 5. Testing: a test is a program that calls the tools

There is no test framework, no server started for a test, no port and no HTTP client
involved in running one. A tool in this codebase is a function — `tool.create_ticket`,
`tool.update_ticket`, and so on, one per line of the `tools` block in `schema.wz` — so a
test is simply a Wantzel program that calls that function directly and checks what it
returned. `tests/create.wz` is representative:

```pascal
include "json.wz";
include "mcphttp.wz";
include "router.wz";

include "../src/schema.wz";
include "../src/tickets.wz";
include "../src/query.wz";
include "tools.wz";
include "_helpers.wz";

procedure app.request; begin end;   // lib/http.wz leaves this open; a test serves nothing

begin
  t.start("create");

  CreateArgs.clear(t.ca);
  t.ca[0].title_n := io.push(t.ca[0].title, 0, "A ticket with only a title");
  TicketOne.clear(t.one);
  t.rc := tool.create_ticket(t.ca, t.one);
  t.eqint(t.rc, 0, "a title alone is enough to create a ticket");
  t.eqtext(t.one[0].ticket.status, t.one[0].ticket.status_n, "todo", "a new ticket starts as todo");
  ...

  t.done;
end.
```

It includes the same source files the real server does, fills in an arguments record by
hand instead of parsing JSON, calls the tool function, and compares the result with a
small set of helpers from `tests/_helpers.wz` — `t.ok`, `t.eqint`, `t.eqtext`, each
reporting what was expected and what came back rather than an assertion line number.
`app.request` is left empty because a test never serves a request; it is only present
because `lib/http.wz`, included transitively, expects the application to define it.

There are five test files under `tests/`: `create.wz`, `get_delete.wz`, `update.wz`,
`list_order.wz`. Files beginning with an underscore are includes, not tests, and the
runner skips them -- which is why the shared machinery lives in `_helpers.wz`.
Each of the four real test files targets one area — `create.wz` the defaults and
validation on `create_ticket`, `update.wz` the "only what was sent changes" behavior,
`list_order.wz` the newest-first ordering and the `truncated` flag when a list is capped.
That last one is worth reading once: its opening comment says it caught two real bugs
during development — an id built with padding in the wrong place, and an insertion loop
that confused "not full yet" with "beats the smallest kept value" — both found by a test
that never opened a socket.

## The compiler is the first judge

Because a test is an ordinary program, it has to compile before it can run, and a test
that fails to compile counts as a failing test — there is no separate "does this build"
step to skip past. Running the suite makes that visible directly:

```bash
./wzttest              # every test in tests/
./wzttest create        # only tests whose filename contains "create"
```

For each file, `wzttest` compiles it with the Wantzel compiler; if that fails, it prints
the compiler's output and counts the test as failed without ever running anything. If it
compiles, `wzttest` gives the resulting program its own fresh, empty data directory as
its first command-line argument (`tests/_helpers.wz`'s `t.start` reads that argument and
points the ticket store at it) and runs it. Each test gets a directory nobody else
touches, so tests cannot see each other's tickets and their order does not matter.

A passing test prints its name and how many checks it ran, such as `create ok (9
checks)` — not just that it passed, but how much it actually checked, so a test that
silently stopped checking partway through does not look identical to one that checked
everything and passed. A failing check prints what was expected and what came back; a
failing compile prints the compiler's own error.

Because there is no server in the loop, the whole suite runs in a fraction of a second —
calling a function is not slower here than calling a function anywhere else, and nothing
about testing this application requires more machinery than that.

---

This was the last of the tutorial. Together, [1](01-what-a-ticket-is.md) through
[5](05-testing.md) cover the whole shape of the service: what a ticket is and why it is a
file, how one declaration becomes three interfaces, what storing tickets as files costs
and buys, how the UI is just another caller of the same tools, and how a test calls those
tools directly. Reading `src/schema.wz` after this should read like the summary it is.
