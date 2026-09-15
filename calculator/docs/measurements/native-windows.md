# Measurements on real Windows

Every measurement taken on a Windows machine, with its date and conditions. The README quotes
the lowest per version; this file keeps all of them, so an outlier stays recognisable later.

The programs measure themselves: `GetSystemTimeAsFileTime` from their own first instruction
until the window is on screen, and `GetProcessMemoryInfo` from `psapi.dll` for the memory.
That excludes the operating system's process startup — an external script measures more, and
therefore something else.

## 15 September 2026, Windows 11 in Windows Sandbox

The sandbox has nothing installed: no antivirus reading along, no background processes. That
makes it a better measuring environment than an ordinary installation, not a worse one.

### Round 1 — before the AdjustWindowRect fix

The window was still too narrow here: the fourth column of keys was half off the edge,
because `CreateWindowEx` takes the outside size and that works out differently on Windows 11
than under Wine.

| version | start | peak working set |
|---|---:|---:|
| win32-controls | **52 ms** | 11,884 kB |
| win32-owner-drawn | **39 ms** | 11,924 kB |
| win32-separated | **42 ms** | 11,928 kB |

One measurement per version: the file was still overwritten on every start.

### Round 2 — after the fix, three starts per version

| version | start | peak working set |
|---|---:|---:|
| win32-controls | 60 ms | 11,904 kB |
| win32-owner-drawn | 47 ms | 11,932 kB |
| win32-separated | 63 ms | 11,952 kB |

**These are also one figure per version, and that is a shortcoming of this round**: the file
was still being overwritten, so this is the *last* start rather than the lowest of three.

So why round 2 came out higher than round 1 is not explained. It could be the extra
`AdjustWindowRect` call; it could be spread between runs. From the next round on the file is
appended to (`FILE_APPEND_DATA` with `OPEN_ALWAYS`), so every start leaves a line and this
can be read off instead of argued about.

### For comparison, the same executables under Wine on WSL2

| version | measured by the program | measured from outside |
|---|---:|---:|
| win32-controls | 136 ms | ~660 ms |
| win32-owner-drawn | ~250 ms | ~660 ms |
| win32-separated | 181 ms | ~660 ms |

An **empty** window — one `RegisterClassEx`, one `CreateWindowEx`, an empty message loop,
46,592 bytes — also measures ~660 ms under Wine. That is what shows the outside figure is
Wine's process startup and not the program.

## What the README quotes

The lowest per version: **52 / 39 / 42 ms**, from round 1.
