const STATUS=['todo','doing','done'];
// The arrow IS the meaning: a person to an agent, an agent back to a person, one
// agent to another. Reading "H>A" tells you the direction without a legend.
const FLOW={h2a:'H&rarr;A',a2h:'A&rarr;H',a2a:'A&rarr;A',h2h:'H&rarr;H'};
let all=[],cur=null,view='board';
// The clean/everything switch. Remembered, because someone who wants clean tickets wants
// them tomorrow too -- a setting you have to make every morning is a setting you turn off.
let showagent=localStorage.getItem('showagent')==='1';
const $=i=>document.getElementById(i);
const esc=s=>(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

// One door for everything, the same one an agent uses.
async function api(tool,args){
const r=await fetch('/api/'+tool,{method:'POST',
headers:{'Content-Type':'application/json'},body:JSON.stringify(args||{})});
const j=await r.json();
if(j.detail){alert(j.detail);throw new Error(j.detail)}return j}

// One fetch, then filter in the page: at this size that is instant, and typing in the
// search box does not hit the server on every keystroke.
async function load(){
const j=await api('list_tickets',{limit:200});
all=j.tickets;
$('count').textContent=j.matched+' tickets'+(j.truncated?' (showing '+j.returned+')':'');
fill('fm','milestone');fill('fa','area');draw()}

function fill(id,f){const s=$(id),k=s.value;
const v=[...new Set(all.map(t=>t[f]).filter(Boolean))].sort();
s.length=1;for(const x of v){const o=document.createElement('option');o.textContent=x;s.appendChild(o)}
s.value=k}

function match(t){const q=$('q').value.toLowerCase();
if(q){const hay=(t.title+' '+(t.body||'')+' '+(t.assignee||'')+' '+(t.milestone||'')
+' '+(t.labels||[]).join(' ')+' '+t.id).toLowerCase();
if(!hay.includes(q))return false}
if($('fm').value&&t.milestone!==$('fm').value)return false;
if($('fa').value&&t.area!==$('fa').value)return false;
if($('fp').value&&t.priority!==$('fp').value)return false;
if($('ff').value&&t.flow!==$('ff').value)return false;
if($('fk').value&&t.kind!==$('fk').value)return false;
return true}

function setview(v){view=v;
$('vb').className=v==='board'?'on':'';$('vl').className=v==='list'?'on':'';
$('board').style.display=v==='board'?'':'none';
$('list').style.display=v==='list'?'':'none';draw()}

function draw(){view==='board'?drawBoard():drawList()}

// ---- board ---------------------------------------------------------------
function drawBoard(){const b=$('board');b.innerHTML='';
for(const s of STATUS){const ts=all.filter(t=>t.status===s&&match(t));
const col=document.createElement('div');col.className='col';col.dataset.s=s;
col.innerHTML='<h2>'+s+' <b>'+ts.length+'</b></h2>';
if(!ts.length)col.innerHTML+='<div class="empty">nothing here</div>';
for(const t of ts)col.appendChild(card(t));
col.ondragover=e=>{e.preventDefault();col.classList.add('over')};
col.ondragleave=()=>col.classList.remove('over');
col.ondrop=e=>{e.preventDefault();col.classList.remove('over');move(e.dataTransfer.getData('id'),s)};
b.appendChild(col)}}

function card(t){const d=document.createElement('div');d.className='card';
d.draggable=true;d.onclick=()=>open_(t);
d.ondragstart=e=>{e.dataTransfer.setData('id',t.id);d.classList.add('drag')};
d.ondragend=()=>d.classList.remove('drag');
d.innerHTML='<div class="t">'+esc(t.title)+'</div><div class="meta">'+pills(t)+'</div>';
return d}

function pills(t){let m='<span class="id">'+t.id+'</span>';
m+='<span class="pill'+(t.priority==='P0'?' p0':'')+'">'+t.priority+'</span>';
if(t.kind)m+='<span class="pill">'+esc(t.kind)+'</span>';
m+='<span class="pill">'+esc(t.area)+'</span>';
if(t.flow)m+='<span class="pill flow f-'+t.flow+'">'+FLOW[t.flow]+'</span>';
if(t.milestone)m+='<span class="pill mark">'+esc(t.milestone)+'</span>';
for(const l of (t.labels||[]))m+='<span class="pill lab">'+esc(l)+'</span>';
if(t.assignee)m+='<span>@'+esc(t.assignee)+'</span>';
const nc=(t.comments||[]).filter(forme).length;
if(nc)m+='<span>&#128172; '+nc+'</span>';
const nh=hidden(t);
if(nh&&!showagent)m+='<span class="ghost" title="agent entries, hidden">&#9673; '+nh+'</span>';
return m}

// Dropping a card is update_ticket, nothing more. The card moves immediately and the
// call follows: at this speed the answer is back before you let go of the mouse, and
// a reload afterwards keeps the page honest if the server disagreed.
async function move(id,status){
const t=all.find(x=>x.id===id);if(!t||t.status===status)return;
t.status=status;draw();
await api('update_ticket',{id:id,status:status});await load()}

// ---- list ----------------------------------------------------------------
function drawList(){const ts=all.filter(match);
let h='<table><thead><tr><th>id</th><th>title</th><th>status</th><th>prio</th>'+
'<th>flow</th><th>kind</th><th>area</th><th>milestone</th><th>who</th></tr></thead><tbody>';
for(const t of ts){h+='<tr class="r" data-id="'+t.id+'">';
h+='<td class="id">'+t.id+'</td><td class="tt">'+esc(t.title)+'</td>';
h+='<td>'+t.status+'</td><td>'+t.priority+'</td>';
h+='<td class="flow f-'+(t.flow||'')+'">'+(t.flow?FLOW[t.flow]:'')+'</td>';
h+='<td>'+esc(t.kind||'')+'</td>';
h+='<td>'+esc(t.area)+'</td><td>'+esc(t.milestone||'')+'</td>';
h+='<td>'+esc(t.assignee||'')+'</td></tr>'}
if(!ts.length)h+='<tr><td colspan="9" class="empty">nothing matches</td></tr>';
$('list').innerHTML=h+'</tbody></table>';
for(const tr of $('list').querySelectorAll('tr.r'))
tr.onclick=()=>open_(all.find(t=>t.id===tr.dataset.id))}

// ---- the panel -----------------------------------------------------------
// A ticket is a place, so it gets an address: #T-0023 opens it, the back button closes
// it, and a link to a ticket is something you can paste to a colleague -- or to an agent.
function open_(t){cur=t;
if(t&&location.hash!=='#'+t.id)history.pushState({id:t.id},'','#'+t.id);
$('ptitle').textContent=t?t.id+'  '+t.title:'New ticket';
$('del').style.display=t?'':'none';
$('f_title').value=t?t.title:'';
$('f_status').value=t?t.status:'todo';
$('f_priority').value=t?t.priority:'P2';
$('f_kind').value=t&&t.kind?t.kind:'';
$('f_area').value=t?t.area:'';
$('f_flow').value=t&&t.flow?t.flow:'';
$('f_milestone').value=t&&t.milestone?t.milestone:'';
$('f_assignee').value=t&&t.assignee?t.assignee:'';
$('f_labels').value=t&&t.labels?t.labels.join(', '):'';
$('f_body').value=t&&t.body?t.body:'';
$('extra').innerHTML=t?extra(t):'';
$('sheet').classList.add('on');$('f_title').focus()}

// The whole point of the two registers. Folding agent entries away gives you a clean
// tracker; NEVER silently -- a hidden entry is always counted, and the count is a button.
// A clean view that could quietly drop things is a view you learn not to trust, and then
// you turn it off for good and the feature has achieved nothing.
function setagent(on){
showagent=on;localStorage.setItem('showagent',on?'1':'0');
$('ag').classList.toggle('on',on);$('ag').textContent=on?'Everything':'Clean';
if(cur)$('extra').innerHTML=extra(cur);
draw()}

const forme=e=>showagent||(e.audience||'human')!=='agent';

// How many entries the clean view is holding back, so it can say so.
function hidden(t){
return [...(t.comments||[]),...(t.worklog||[])].filter(e=>(e.audience||'human')==='agent').length}

// The record and the conversation, both append-only: there is no edit button, because
// a log you can tidy up afterwards is not a log.
function extra(t){let h='';
const nh=hidden(t);
if(nh&&!showagent)h+='<div class="fold" onclick="setagent(true)">'+nh+
' agent '+(nh===1?'entry':'entries')+' hidden &middot; show</div>';
const wl=(t.worklog||[]).filter(forme);
if(wl.length){h+='<h4>Work log</h4><ul class="log">';
for(const l of wl)h+='<li'+(l.audience==='agent'?' class="ag"':'')+'>'+
esc(l.at)+' &middot; '+esc(l.text)+'</li>';h+='</ul>'}
h+='<div class="row" style="margin-top:.7rem">'+
'<input id="logtext" placeholder="record what you found or decided" style="flex:1">'+
'<label class="chk"><input type="checkbox" id="logag"> for agents</label>'+
'<button onclick="addlog()">Log</button></div>';
h+='<h4>Comments</h4>';
const cs=(t.comments||[]).filter(forme);
for(const c of cs)
h+='<div class="entry'+(c.audience==='agent'?' ag':'')+'"><div class="who">'+
esc(c.author)+' &middot; '+esc(c.at)+
(c.audience==='agent'?' <span class="tag">agent</span>':'')+
'</div><p>'+esc(c.text)+'</p></div>';
if(!cs.length)h+='<div class="empty">nothing said yet</div>';
h+='<div class="row" style="margin-top:.6rem">'+
'<input id="cwho" placeholder="you" size="10">'+
'<input id="ctext" placeholder="say something" style="flex:1">'+
'<label class="chk"><input type="checkbox" id="cag"> for agents</label>'+
'<button onclick="addcomment()">Comment</button></div>';
return h}

async function addlog(){const v=$('logtext').value.trim();if(!v||!cur)return;
await api('log_work',{id:cur.id,text:v,audience:$('logag').checked?'agent':'human'});await load();
open_(all.find(t=>t.id===cur.id))}

async function addcomment(){const v=$('ctext').value.trim();if(!v||!cur)return;
const who=$('cwho').value.trim()||'someone';
await api('add_comment',{id:cur.id,author:who,text:v,
audience:$('cag').checked?'agent':'human'});await load();
open_(all.find(t=>t.id===cur.id))}

function close_(){$('sheet').classList.remove('on');cur=null;
if(location.hash)history.pushState({},'',location.pathname)}

// Opening from the address bar: on first load, and on back/forward.
function fromhash(){
const id=location.hash.slice(1);
if(!id){if(cur){$('sheet').classList.remove('on');cur=null}return}
const t=all.find(x=>x.id===id);
if(t&&t!==cur)open_(t)}
addEventListener('popstate',fromhash);

function fields(){const L=$('f_labels').value.split(',').map(s=>s.trim()).filter(Boolean);
const o={title:$('f_title').value.trim(),body:$('f_body').value,
priority:$('f_priority').value,area:$('f_area').value.trim()||'general',labels:L};
o.kind=$('f_kind').value||null;
o.flow=$('f_flow').value||null;
o.milestone=$('f_milestone').value.trim()||null;
o.assignee=$('f_assignee').value.trim()||null;return o}

async function save(){const f=fields();
if(!f.title){alert('A ticket needs a title.');return}
if(cur){f.id=cur.id;f.status=$('f_status').value;await api('update_ticket',f)}
else{const c={...f};delete c.status;await api('create_ticket',c)}
close_();await load()}

async function del(){if(!cur||!confirm('Delete '+cur.id+'?'))return;
await api('delete_ticket',{id:cur.id});close_();await load()}

for(const i of ['q','fm','fa','fp','fk','ff'])$(i).addEventListener('input',draw);
document.addEventListener('keydown',e=>{if(e.key==='Escape')close_()});
setagent(showagent);
load().then(fromhash);
