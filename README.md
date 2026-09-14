# Wantzel demos

Real applications written in [Wantzel](https://wantzel.com), each small enough to read in
full. They answer the question a language project cannot answer about itself: **what would
you actually build with this?**

> 🌱 The language is pre-1.0 and still changing; so may these programs.

## 📋 wantzel-tasks

A ticket system for people *and* agents — a kanban board, a list, a REST API and an MCP
server in one 600 kB binary, with no dependencies. It was built autonomously by an AI agent
one day after the compiler's first release, and the backlog you see in it is its own.

[![The wantzel-tasks board](wantzel-tasks/docs/img/01-board-desktop-light.png)](https://wantzel.github.io/demos/wantzel-tasks/docs/)

| | |
|---|---|
| 📖 **the walkthrough** | **[wantzel.github.io/demos/wantzel-tasks/docs](https://wantzel.github.io/demos/wantzel-tasks/docs/)** — a real MCP session, what goes over the wire, and how it fits together |
| 📄 the README | [wantzel-tasks/](wantzel-tasks/) |
| 💻 the source | [wantzel-tasks/src/](wantzel-tasks/src/) — the whole interface is one file, [`schema.wz`](wantzel-tasks/src/schema.wz) |

```bash
git clone https://github.com/wantzel/demos
cd demos/wantzel-tasks
./wztrun          # builds in ~30 ms, then serves on http://127.0.0.1:7777
```

You need the [Wantzel compiler](https://github.com/wantzel/wantzel/releases) — one binary,
and nothing else to install.

---

MIT, the same as the compiler. Questions: [floris@wantzel.com](mailto:floris@wantzel.com)
