# win32-separated — the way you would actually build it

**What this shows:** the same window as `win32-owner-drawn`, with every platform detail moved
one file down. `main.wz` contains no structure offsets, no message loop, no callback, no DLL
name and no colour value — it is a description of a calculator.

This is the one to read if you want to know what building a GUI application in Wantzel
*feels* like, rather than what it requires underneath.

## What it demonstrates about GUIs in Wantzel

That the low-level work is a **layer, not a tax**. The other versions each carry their own
platform code, which is honest for an example and is not how you would build a second
application. Here the platform lives in `win.wz` and the application looks like this:

```pascal
place("7",   2, 0, 0 - 7,   WK.CARD,   WK.INK);
place("8",   2, 1, 0 - 8,   WK.CARD,   WK.INK);
place("*",   2, 3, K_MUL,   WK.SOFT,   WK.INK);
```

Reading that *is* reading the layout. And the handler is the only one in the program:

```pascal
procedure win.dispatch(i: int);
begin
  if means[i] = DIGIT0 then calc.digit(0)
  else if means[i] < 0 then calc.digit(0 - means[i])
  else calc.key(means[i]);
  refresh;
end;
```

No `WM_COMMAND`, no `wParam`, no window handle. The callback still happens — Windows has no
other way to deliver a click — but it happens inside `win.wz`, which turns it into a key
index and calls this.

## Three layers

```
main.wz       the calculator: which keys exist, what each means, what to show
widgets.wz    keys, a grid, the painting, and the window procedure that dispatches
win32.wz      the platform: WNDCLASSEXA, the message loop, fonts, the manifest, every DLL name
calc.wz       the arithmetic
```

`x11-separated` has exactly the same four files, with `x11.wz` in place of `win32.wz`.

| | `win32.wz` | `widgets.wz` | `main.wz` |
|---|---|---|---|
| knows the platform | **yes** | no | no |
| knows what a keypad is | no | **yes** | no |
| knows what a calculator is | no | no | **yes** |

The window procedure sits in `widgets.wz` rather than `win32.wz`, which is the one placement
worth explaining: turning a click into a *key index* is a widget question, not a platform
one. `win32.wz` forward-declares it, because `win.open` has to hand its address to the
system — and that forward declaration is the whole of the coupling between the two.

## The details that cost time

**The namespace is case-insensitive.** `WIN.HOVER` as a constant and `win.hover` as a
variable are the *same name*, and the error says `duplicate global declaration` without
saying which. The constants here are `WK.*` for that reason — "constant in capitals,
variable in lower case" is a habit from other languages that does not work.

**A library file cannot use a global scratch variable called `i`** if any routine also
declares one: there is one flat namespace, so they collide.

## What is still not hidden

`win.wz` is a file in this directory, not a shipped library. Deciding what belongs in a real
`lib/win.wz` — and what an application should be allowed to reach around it — is a separate
question that this example deliberately does not answer.
