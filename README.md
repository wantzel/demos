# Wantzel demos

Real applications written in [Wantzel](https://github.com/wantzel/wantzel), each in its own
folder. They are here to answer the question a language project cannot answer about itself:
**what would you actually build with this?**

> **Early days.** The language is pre-1.0 and may still change; so may these programs.

## What is in here

Each folder is one self-contained application with its own `README.md` saying what it does,
how to build it and what to expect when you run it.

<!-- Add a row when a demo lands. -->

| demo | what it is |
|---|---|
| _(the first ones are on their way)_ | |

## Building one

You need the Wantzel compiler — one binary, nothing else:

```bash
# from a release
curl -L -o wantzel https://github.com/wantzel/wantzel/releases/latest/download/wantzel-linux-x86_64
chmod +x wantzel

# or build it from source, which needs a C compiler exactly once
git clone https://github.com/wantzel/wantzel && cd wantzel && ./build.sh
```

Then, in a demo's folder:

```bash
wantzel main.wz demo && ./demo
```

There is nothing to install, no package manager, and no runtime: the result is a static
executable. The same compiler cross-compiles to Windows.

## What belongs here

A demo earns its place by being **software someone would want**, not by showing off a
language feature. Two rules follow from that:

- **Small enough to read in full.** If nobody can read the whole source, it proves nothing
  about the language — it is just software that happens to compile.
- **Honest about what it does.** No benchmark without its method, and no claim the code
  does not back up.

## License

MIT, the same as the compiler. See [LICENSE](LICENSE).
