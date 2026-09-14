# Wantzel demos

**[📖 Browse the demos, with screenshots and walkthroughs →](https://wantzel.github.io/demos/)**

Real applications written in [Wantzel](https://github.com/wantzel/wantzel), each in its own
folder. They are here to answer the question a language project cannot answer about itself:
**what would you actually build with this?**

> 🌱 **Early days.** The language is pre-1.0 and may still change; so may these programs.

## 📦 What is in here

Each folder is one self-contained application with its own `README.md` saying what it does,
how to build it and what to expect when you run it.

| demo | what it is |
|---|---|
| 📋 **[wantzel-tasks](wantzel-tasks/)** | A ticket system for people *and* agents: a kanban board, a list, a REST API and an MCP server — one 600 kB binary, one port, no dependencies. Built autonomously by an AI agent one day after the compiler's first release. **[→ walkthrough](https://wantzel.github.io/demos/wantzel-tasks/docs/)** |

<!-- Add a row when a demo lands. -->

## 🔨 What you need

The Wantzel compiler — one binary, nothing else:

```bash
curl -L -o wantzel https://github.com/wantzel/wantzel/releases/download/v0.1.2/wantzel-0.1.2-linux-x86_64
chmod +x wantzel && ./wantzel --version
```

The asset carries its version, so there is no `latest/download` shortcut — take the newest
tag from [the releases page](https://github.com/wantzel/wantzel/releases). Windows builds
are there too.

Or build it from source, which needs a C compiler exactly once:

```bash
git clone https://github.com/wantzel/wantzel && cd wantzel && ./build.sh
```

**How to build and run a demo is in that demo's own README** — each one carries a script
that does it. There is nothing to install beyond the compiler, no package manager and no
runtime: the result is a static executable, and the same compiler cross-compiles to Windows.

## ✅ What belongs here

A demo earns its place by being **software someone would want**, not by showing off a
language feature. Two rules follow from that:

- **Small enough to read in full.** If nobody can read the whole source, it proves nothing
  about the language — it is just software that happens to compile.
- **Honest about what it does.** No benchmark without its method, and no claim the code
  does not back up.

## ⚖️ License

MIT, the same as the compiler. See [LICENSE](LICENSE).
