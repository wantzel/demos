# win32-controls — letting Windows draw

**What this shows:** the shortest route to a working native window. Each key is a `BUTTON`
control that the system creates, draws and animates; the program only says where they go and
answers when one is pressed.

![win32-controls](screenshot.png)

*Windows draws the buttons; the program places them.*

## What it demonstrates about GUIs in Wantzel

Two things the language had to be able to do, and both are visible here in a few lines.

**Reaching an API the compiler has never heard of.** The DLL and the function are named in
the source:

```pascal
winapi("user32.dll", "CreateWindowExA", 0, addr(cname[0]), ...)
```

The name is recorded while translating and written into the executable's import table.
Reaching a new Windows API is a line of ordinary source, not a compiler release.

**Being called back.** This is the part that needed a language feature. A button click is
*sent* straight to the window procedure and never appears in the message loop, so no loop —
however written — can see it. `winproc(wndproc)` hands the system the address of an adapter
the compiler writes next to your routine.

## How it works

```
GetModuleHandleA     the instance handle
RegisterClassExA     an 80-byte structure with our window procedure in it
CreateWindowExA      the window, then one per key
GetMessage/Dispatch  the loop, which handles everything EXCEPT the clicks
wndproc              which is where the clicks actually arrive
```

## The details that cost time

**WNDCLASSEXA is 80 bytes on x64 and `lpfnWndProc` sits at offset 8, not 4.** A pointer
aligns to eight. Get it wrong and the system refuses the class without saying why.

**The adapter must preserve rdi, rsi and rbx.** Those are *yours to destroy* on Linux and
*yours to preserve* on Windows — the one point where the two conventions disagree about
ownership. Getting it wrong does not crash at the call; it crashes later, somewhere
unrelated.

**A missing DLL fails at load time; a misspelled function fails at the call.** The loader
refuses a process whose DLL is absent, but a missing *function* in a DLL that exists gets a
stub that only complains when something calls it. So a typo on a rare path sits quietly —
exercise every `winapi` call once in a test.

## What it looks like

Like Windows, because it is Windows drawing it. That is the honest result and the reason the
next directory exists.

## One thing Wine did not catch

`CreateWindowEx` takes the **outside** size — the client area plus border and title bar — so
asking for the size you want to draw in gives a window that is too small. How much too small
differs between Windows versions and between Windows and Wine: under Wine it fell within the
margin, and on Windows 11 the fourth column of keys was half off the edge.

`AdjustWindowRect` converts the client rectangle you want into the outside rectangle to ask
for. Note that its `left` and `top` come back **negative** — the border sits outside the
client area — so an unsigned 32-bit read gives about four billion.

The general lesson: **as soon as pixels, borders or sizes are involved, Wine is not proof.**
