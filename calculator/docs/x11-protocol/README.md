# x11-protocol — a window with nothing underneath

**What this shows:** that a GUI needs no toolkit. X11 is a binary protocol over a Unix
socket, and `libX11` is an encoder for it — not a privileged component. A program that can
open a socket can draw a window, and this one does, in about four hundred lines.

![x11-protocol](screenshot.png)

*The X11 version: every pixel drawn by this program.*

## What it demonstrates about GUIs in Wantzel

Everything on screen here is a request written into a buffer and pushed down a socket. There
is no library between the program and the display server. That is the extreme end of "no
dependencies": not *few* libraries but *none*, and the binary is 39 kB with nothing linked
in at all.

It also shows what the language needs for this, which is **nothing**. `sysN` emits the
system call instruction and the number is an ordinary constant, so a socket, a read and a
write are reachable without touching the compiler.

## How it works

```
connect   open /tmp/.X11-unix/X0, send the handshake, read back the id base and mask
setup     CreateWindow, set the title, open two fonts, make a graphics context, MapWindow
paint     fill rectangles and draw text, one request each
loop      read 32-byte events off the socket and react
```

## The details that cost time

**Lengths are in units of four bytes, not bytes.** A CreateWindow declared as 10 words when
the request is 8 gives `BadLength` — against a request that looks correct. Every request is
padded to a multiple of four, and forgetting once puts the stream out of step from there on.

**Two different things are called "mask".** The *value mask* of CreateWindow says which
attributes follow; the *event mask* is one of those attributes. Putting an event bit into
the value mask gives `BadValue` and no window.

**You build resource ids yourself**: `id := base bor (n band mask)`. The server does not
hand them out.

**A font name with zeros asks for a scalable font.** `-adobe-helvetica-bold-r-normal--18-0-0-0-p-0-iso8859-1`
renders at 18 pixels; a *fixed* size the server does not have fails silently and leaves the
6-pixel default in place.

**And every one of those failures is silent.** X11 answers errors asynchronously, so the
program carries on and simply draws nothing. The failure mode is almost never a message —
it is "nothing happened". Read the socket while developing.

## What it is not

The text is not anti-aliased. X11 core fonts are one bit per pixel, a property of the 1987
protocol rather than of this program. Smooth text needs the XRender extension, which means
rendering glyphs yourself and sending them as images.
