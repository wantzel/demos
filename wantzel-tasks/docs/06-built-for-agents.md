# 6. Built for agents, and what that actually changes

This part is not about Wantzel. It is about what a ticket system has to do differently when
most of the writing is done by machines — and it is the reason this project is a tool we
use rather than a demonstration we wrote.

## The problem is volume, not quality

Agent output is usually fine. There is just an enormous amount of it, arriving fast.

A person investigating a bug writes one line: *"the cap was there, the answer did not
mention it."* An agent investigating the same bug writes the four hundred lines that led to
that sentence — what it read, what it ruled out, the two approaches that failed. Both are
worth having. The four hundred lines are what make the decision reconstructable in a month
by someone who was not there. But they are not what a person scanning a backlog on Monday
morning needs.

A week of this and the ticket that took a minute to read takes twenty. So people stop
reading tickets. The record still exists and nobody consults it, which is indistinguishable
from not having one.

This is the failure mode of every tracker we have watched agents get pointed at. It is not
a bug in those trackers. They were designed when the cost of writing a comment was a
person's time, and that cost did the filtering for free.

## Two answers that both lose

**Forbid agents to write.** You keep the tickets readable and lose precisely the detail
that made them worth keeping. The next person to touch the problem starts from zero.

**Let them write, and tell people to skim.** People do not skim; they disengage. Within a
sprint the humans are working from chat and the tickets are an audit log nobody opens.

Both answers treat the two kinds of writing as if they were the same kind, competing for
one space. They are not.

## The decision: two registers, and the reader picks

Every comment and every work log line carries an `audience`:

| | |
|---|---|
| `human` | short, plain, written to be read by a person |
| `agent` | complete, detailed, written to be read by a machine |

The default is `human`. A field that defaults to the noisy value fills up with noise on its
own, and an author who has not thought about audience is nearly always writing for a person.

One switch in the top bar — labelled **Clean** / **Everything** — folds every `agent` entry
away, everywhere at once: the cards, the list and the open ticket. It is remembered in the
browser, so someone who wants clean tickets sets it once and never again.

In the clean view a ticket shows its human comments and human work log, with a line above
them reading *"2 agent entries hidden · show"* — which is itself the button. Flip it and the
agent entries appear in place, tinted and tagged, so you can read how the agents worked
through the problem without leaving the ticket.

### Why it is per entry and not per ticket

A ticket collects a human line, three hundred agent lines, and another human line, all
interleaved. A `verbose` flag on the ticket would force you to choose a register for the
*container*, when the register belongs to each thing written into it. Per entry is the only
split that survives contact with a real ticket.

### Why a hidden entry is always counted

The clean view says *"11 agent entries hidden"* and you can click it. It never simply drops
them.

That is the whole feature, actually. If the clean view could silently omit things, you
would learn not to trust it, and then you would turn it off permanently and be back where
you started. Announcing the fold is what makes it safe to use — and it means you can always
look at how the agents talked to each other, in the same ticket, without leaving it.

## `flow`: who is talking to whom

A closed set of four, deliberately not a label:

```
h2a   a person asked an agent to do something
a2h   an agent needs a person: a decision, an approval, a credential
a2a   one agent handed work to another
h2h   two people, the way tickets have always worked
```

It answers the question that matters most in a mixed backlog: **what is waiting on me?**

An `a2h` ticket is blocking a machine that would otherwise still be working. That is a
different kind of urgent from a P0 nobody has started, and neither `status` nor `priority`
can express it — `todo` does not distinguish "not started" from "stopped, waiting for a
human." So it is a field.

A label would not do. Labels are free-form and mean whatever a team decides; this changes
how a ticket is *read*, so it has to mean the same thing in every installation.

## Claiming: a conditional write, not an update

Two agents reading the same backlog pick the same top ticket, because they are looking at
the same order and they are both right. With people, a standup resolves this. With agents
it is two hours of duplicated work, discovered at merge time.

`update_ticket` cannot fix it. Read-then-write leaves a gap between the read and the write,
and that gap is exactly where both agents decide to go.

`claim_ticket(id, who)` sets the assignee and the status in one call and **refuses** if the
ticket is already held. The refusal is the useful half: the second agent learns immediately
and takes the next ticket instead of finding out at merge time.

`release_ticket(id)` exists because an agent that dies holding a claim has removed that
ticket from the backlog for everyone, and nothing else can give it back.

## `next_ticket`: put the ordering rule on the server

Without it, every agent implements this itself: list everything, filter for todo, drop the
assigned ones, drop the ones with open blockers, sort by priority, take the first. Five
steps, and each agent gets them subtly differently — so two agents disagree about what
"next" is while both believe they are following the backlog.

One call, one rule, one answer:

1. not done, and not assigned to someone else
2. nothing unfinished blocking it
3. highest priority first
4. oldest first within a priority — newest-first starves the oldest work, forever

An empty answer is a normal result, not an error. "Nothing to do" is a state a backlog is
often in, and an agent should not have to catch an exception to discover it.

## What we deliberately did not build

Each of these was considered and dropped, because a ticket system for agents fails the same
way every other tracker fails — by acquiring fields nobody fills in.

- **More statuses.** Three. Every extra one is a decision someone has to make on every
  ticket, forever, and `todo`/`doing`/`done` has never yet been the thing that was missing.
- **Per-agent permissions.** One process, one backlog. The moment you need to defend a
  backlog from its own agents, the problem is upstream of the tracker.
- **Automatic summarising of agent threads.** Tempting, and wrong: a summary written by a
  machine of machine output is where the detail silently disappears. The fold already
  solves the reading problem, and it is reversible.
- **Threaded replies.** A ticket is a thread. Threads inside threads are how trackers become
  unreadable, and agents would nest them four deep by Tuesday.

## The honest limit

One process writes. Two servers on the same directory would need locking, and that is a
different program. A ticket holds a stated maximum number of comments and work log lines,
and reaching it **refuses the write** rather than dropping it — because a silent drop is
data loss that looks like success, and an agent can act on a refusal by summarising into
the work log and starting fresh.
