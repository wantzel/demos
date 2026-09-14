# 4. The UI: real files, compiled into the binary

The page is **not** written in Wantzel. It is three ordinary files:

```
web/app.css     styles
web/app.html    markup
web/app.js      behaviour
```

An editor highlights them, the browser's dev tools recognise them, and changing a CSS rule
is changing a CSS rule.

## The first version, and why it was wrong

They started out as string constants inside `src/ui.wz` — 268 calls to `http.add`, each
with its quotes escaped:

```pascal
http.add("<button id=\"vl\" onclick=\"setview('list')\">List</button>");
```

That works, and it is how web applications were written twenty years ago. The problem is
not that it is old-fashioned; it is that **you cannot read it**. No highlighting, no
formatter, and every change to the markup means counting backslashes. For a project whose
entire argument is "read this and see how clean it can be", the frontend was the part that
undermined the claim.

## What could not change

One binary, no dependencies, nothing to install. Serving `web/` from disk at run time would
break exactly that — the binary would stop working the moment someone moved it without its
directory.

So the files are read at **build** time, not run time:

```
web/app.css  ->
web/app.html ->   tools/wzgen.wz   ->   src/assets.wz   ->   linked into the binary
web/app.js   ->
```

`tools/wzgen.wz` is a Wantzel program that turns each file into a procedure of string
constants, breaking the output into readable lines. `wztrun` runs it whenever a file under
`web/` is newer than the generated source, and `src/assets.wz` is committed so a fresh
clone builds with nothing but the compiler.

## What is left in ui.wz

The whole file is now the page assembly — which is the only part that was ever a program:

```pascal
procedure ui.page;
begin
  http.add("<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\">");
  http.add("<title>wantzel-tasks</title>");
  http.add("<style>");
  asset.css;
  http.add("</style></head><body>");
  asset.html;
  http.add("<script>");
  asset.js;
  http.add("</script></body></html>");
  http.finish(200, "text/html; charset=utf-8");
end;
```

351 lines became 34. Nothing about the served page changed.

## Why not a template language

Because then the demo would be showing you a template language instead of showing you
Wantzel. The page is static: it ships no data. Everything it displays arrives over the same
`POST /api/<tool>` an agent calls, after the page has loaded. There is nothing to
interpolate, so there is nothing for a template engine to do.

`ui.css` writes a `<style>` block, `ui.body` the markup for the header, the filter bar,
the board and list containers, and the edit panel, and `ui.script` a `<script>` block —
plain JavaScript, no framework, talking to the server through `fetch`. That is the whole
build step: compile the Wantzel program, and the page exists.

## Board and list are the same tickets

The toggle at the top switches `view` between `'board'` and `'list'`; both read from the
same `all` array, fetched once with a single call to `list_tickets`:

```javascript
async function load(){
  const j = await api('list_tickets', {limit: 200});
  all = j.tickets;
  ...
}
```

`drawBoard` groups `all` into three columns by `status` (`todo`, `doing`, `done`) and
renders a card per ticket; `drawList` renders the same array as table rows. Filtering by
search text, milestone, area, priority or kind happens client-side, in `match(t)`,
against the tickets already in memory — not as separate server calls per filter. At the
sizes this format is built for, filtering 200 already-loaded tickets in the browser is
instant, and typing in the search box does not need to hit the server on every keystroke.

## Every action is a tool call

`api(tool, args)` is the one function the whole page uses to talk to the server:

```javascript
async function api(tool,args){
  const r = await fetch('/api/'+tool, {method:'POST',
    headers:{'Content-Type':'application/json'}, body:JSON.stringify(args||{})});
  const j = await r.json();
  if(j.detail){alert(j.detail);throw new Error(j.detail)}
  return j;
}
```

That is `POST /api/<tool>` — the same REST route described in
[2. One declaration, three interfaces](02-one-declaration-three-interfaces.md), reached
with the browser's own `fetch`. Creating a ticket calls `create_ticket`. Adding a comment
calls `add_comment`. Recording a line in the work log calls `log_work`. And dragging a
card from `todo` to `doing` calls `update_ticket` with the new status, nothing more:

```javascript
async function move(id,status){
  const t=all.find(x=>x.id===id); if(!t||t.status===status) return;
  t.status=status; draw();
  await api('update_ticket',{id:id,status:status}); await load();
}
```

The card moves in the browser immediately, for responsiveness, and the same
`update_ticket` call an MCP agent would make follows right after; `load()` afterwards
re-reads the tickets from the server, so if the server disagreed — a validation failure,
a stale id — the page corrects itself on the next draw rather than staying wrong.

## No private route

This is the point stated in the README, and it is visible directly in the code: search
`ui.wz` for anything that is not `POST /api/<tool>`, and there is nothing. The page has
no endpoint of its own for creating, updating or deleting a ticket — it is a client of
the exact same eight tools an MCP agent calls, over the exact same REST route. If the
board can move a card from `todo` to `doing`, that is because `update_ticket` allows it,
and an agent calling `update_ticket` directly can do anything the board can. There is no
special path where the UI is allowed something the API is not, because the UI has no
path the API doesn't already expose.

Next: [5. Testing](05-testing.md).
