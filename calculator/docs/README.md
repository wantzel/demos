# Five calculators, one program

The same calculator, built five times. Each directory is **complete and self-contained** —
its own `calc.wz`, its own window code, nothing shared. You can copy one out and it will
build.

That duplication is deliberate. These are examples, and an example that only works inside
its own repository teaches you where the other files are rather than how the thing works.

## What a GUI in Wantzel actually is

There is no toolkit here and there is nothing to install. A window comes from talking to
the operating system directly, and the two systems ask for something completely different:

| | X11 | Win32 |
|---|---|---|
| how you reach it | a Unix socket, binary protocol | DLL functions, named in the source |
| who draws | you, every pixel | the system, unless you ask to do it yourself |
| how events arrive | you read them off the socket | **the system calls you** |
| what the language needed | nothing | `winproc`, to hand out a callback |

That last row is the interesting one. On Windows a button click is *sent* straight to a
window procedure and never appears in the message loop, so a program cannot avoid being
called back — and a language with no function pointers had to grow exactly one thing to
allow it. On X11 nothing of the sort is needed: events are bytes on a socket.

## The five

Read them in this order if you are reading them all. Each one adds a single idea.

### 1. [`x11-protocol`](x11-protocol/README.md)

The X11 wire protocol by hand: handshake, resource ids, requests measured in units of four
bytes, and drawing every pixel. No toolkit, no library, nothing linked in.

*[documentation](x11-protocol/README.md) · [source](../src/x11-protocol/)*

### 2. [`win32-controls`](win32-controls/README.md)

The shortest route to a working native window: the system's own `BUTTON` controls, and
answering `WM_COMMAND`. Shows both things the language needed for Windows — reaching an API
by name, and being called back.

*[documentation](win32-controls/README.md) · [source](../src/win32-controls/)*

### 3. [`win32-owner-drawn`](win32-owner-drawn/README.md)

Taking the drawing back: `BS_OWNERDRAW`, a palette of our own, hover and pressed states,
ClearType text. What it costs to stop looking like the platform default.

*[documentation](win32-owner-drawn/README.md) · [source](../src/win32-owner-drawn/)*

### 4. [`win32-separated`](win32-separated/README.md)

The same window in three layers — `main.wz`, `widgets.wz`, `win32.wz` — so the application
file is a description of a calculator and nothing else. **Zero** low-level constructs in it,
counted rather than claimed. This is how you would actually build a second program.

*[documentation](win32-separated/README.md) · [source](../src/win32-separated/)*

### 5. [`x11-separated`](x11-separated/README.md)

The same three layers on the X11 side, with `x11.wz` in place of `win32.wz`. Put next to the
fourth, it shows that the separation is a property of the approach and not of Windows — the
bottom layers have nothing in common and the application files look almost identical.

*[documentation](x11-separated/README.md) · [source](../src/x11-separated/)*

---

Two more directories, `win32-optimized/` and `x11-optimized/`, are where tuning goes later.
They are empty until there is something measured to tune.

## The one thing they all share

Every version contains the same `calc.wz`: the arithmetic, which knows nothing about a
screen. It takes key presses and answers with what the display should read, so it is tested
headless — and it is why writing the fifth front end cost a few hundred lines rather than
starting over.

**Whole numbers only.** There is no floating point anywhere, so every answer is exact and
`√10` is `3`. A calculator that quietly rounds is worse than one that says what it does.
