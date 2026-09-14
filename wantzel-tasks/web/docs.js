// The API reference renders itself from /tools.json, which the compiler generated from
// schema.wz. Nothing here restates a field name: a page that repeats a declaration by
// hand is a page that goes stale on the first change.
const $ = i => document.getElementById(i);
const esc = s => (s || '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let TOOLS = [];

// One property as a row: its name, its type, whether it is required, and the description
// the schema carries. `required` lives on the parent, so it is passed in.
function prop(name, p, required) {
  const t = p.type === 'array' ? (p.items?.type || 'any') + '[]' : (p.type || 'any');
  const lim = p.maxLength ? ' &le;' + p.maxLength : (p.maxItems ? ' &le;' + p.maxItems : '');
  return '<tr><td class="k">' + esc(name) + (required ? '<span class="req">required</span>' : '') +
         '</td><td class="ty">' + esc(t) + '<span class="lim">' + lim + '</span></td>' +
         '<td class="ds">' + esc(p.description || '') + '</td></tr>';
}

function table(schema, empty) {
  const props = schema?.properties || {};
  const keys = Object.keys(props);
  if (!keys.length) return '<p class="empty">' + empty + '</p>';
  const req = schema.required || [];
  return '<table><thead><tr><th>field</th><th>type</th><th>meaning</th></tr></thead><tbody>' +
         keys.map(k => prop(k, props[k], req.includes(k))).join('') + '</tbody></table>';
}

// A body a reader can paste into curl, built from the schema's own required fields.
function example(t) {
  const props = t.inputSchema?.properties || {};
  const req = t.inputSchema?.required || Object.keys(props).slice(0, 1);
  const body = {};
  for (const k of req) {
    const p = props[k] || {};
    body[k] = p.type === 'array' ? [] : (k === 'id' ? 'T-0001' : (p.description || k).split(',')[0].slice(0, 28));
  }
  return "curl -X POST http://127.0.0.1:7777/api/" + t.name + " \\\n" +
         "  -H 'Content-Type: application/json' \\\n" +
         "  -d '" + JSON.stringify(body) + "'";
}

function draw() {
  const f = $('q').value.trim().toLowerCase();
  const show = TOOLS.filter(t => !f || t.name.includes(f) || (t.description || '').toLowerCase().includes(f));
  $('count').textContent = show.length + ' of ' + TOOLS.length + ' tools';
  $('tools').innerHTML = show.map(t =>
    '<section class="tool" id="' + esc(t.name) + '">' +
      '<h2><span class="verb">POST</span> /api/' + esc(t.name) + '</h2>' +
      '<p class="lead">' + esc(t.description || '') + '</p>' +
      '<h3>Arguments</h3>' + table(t.inputSchema, 'takes no arguments') +
      '<h3>Returns</h3>' + table(t.outputSchema, 'returns nothing') +
      '<h3>Try it</h3><pre>' + esc(example(t)) + '</pre>' +
      '<p class="also">The same tool over MCP: <code>' + esc(t.name) + '</code> at ' +
      '<code>POST /mcp</code>, and from the board.</p>' +
    '</section>').join('') || '<p class="empty">nothing matches</p>';
}

(async () => {
  const r = await fetch('/tools.json');
  TOOLS = (await r.json()).tools;
  draw();
  $('q').addEventListener('input', draw);
  if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
})();
