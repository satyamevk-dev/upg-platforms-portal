# Module: Files & error handling

**Track:** Basic · **Module ID:** `pyb-files-errors`

## Overview

This module aligns with the training library topic **Files & error handling**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- Reading and writing text files; context managers (with)
- Path basics and os.path vs pathlib intro
- try / except / else / finally
- Raising exceptions and common built-in types

---

## Lesson 1: Text I/O and the `with` statement

- Open files with **`with open(path, encoding="utf-8") as fh:`** so handles close on success or exception; always set **encoding** explicitly on text to avoid Windows `cp1252` surprises.
- Know **`read`/`readline`/`readlines`** vs. iterating lines lazily; large files should stream, not `read()` whole into RAM.
- Prerequisites: functions module; temp directory for destructive experiments.

## Lesson 2: `pathlib` vs. `os.path` string juggling

- **Happy path**: `Path("data") / "file.csv"` composes paths portably; `path.exists()`, `.read_text()`, `.write_text()` for small files; reserve `os.path` for legacy glue only if required.
- Normalize paths when comparing user input—beware **`..`** segments if constructing filesystem paths from untrusted strings.
- Checkpoints: scripts run on Windows and Linux CI without path separator hacks.

## Lesson 3: `try` / `except` / `else` / `finally` and custom errors

- Catch **specific exceptions** (`FileNotFoundError`, `json.JSONDecodeError`) before broad `Exception`; use **`raise ... from e`** to preserve chains when re-raising.
- **`else` on try** runs when no exception in `try`; **`finally`** always runs—great for cleanup beyond context managers.
- Pitfalls: bare `except:`; swallowing exceptions without logging; using exceptions for normal control flow in tight loops.

## Lesson 4: Raising, logging, and handoff to intermediate track

- **Done** when custom exception classes inherit from **`Exception`** (or a domain base) with clear messages; public APIs document raised types.
- Replace bare **`print`** in reusable libraries with **`logging`** (stdlib module later deepens this).
- Handoff: **OOP** or **stdlib** modules depending on track—files feed real tools.

## Lesson 5: Lab—binary vs text, encodings, and `Path` walks

- Open a small **UTF-8** file with wrong encoding on purpose to see **`UnicodeDecodeError`**; fix with `encoding="utf-8"` and compare **`errors="replace"`** only for log scrubbing scenarios.
- Use **`Path.glob("**/*.py")`** on a tiny repo tree; print relative paths—notice ordering is filesystem-dependent unless sorted.
- Write bytes with **`Path.write_bytes(b"...")`** and read back—contrast with `write_text` for JSON payloads.

## Lesson 6: Anti-patterns in I/O and exceptions

- Catching **`Exception`** and passing silently in libraries—callers cannot distinguish bugs from expected conditions; at least **log** and **chain**.
- Reading entire **multi-gigabyte** logs with `read()` on production jump hosts—stream line-by-line or use `grep`/`rg` first.
- Using **`print` for errors** in long-running daemons—no severity, timestamps, or aggregation; reserve `print` for CLIs.

---

## Key takeaways

- **`with` closes files**—manual `close()` in happy-path-only code leaks on errors.
- **Catch narrow, log context**, re-raise when the caller must decide—silent `except` is debt.
- **`pathlib` reduces string bugs**—treat paths as objects, not strings with slashes.

---

## Quiz

1. Using **`with open(...) as f:`** ensures:  
   A) Files are never locked  
   B) The file is closed when leaving the block, even if an exception occurs  
   C) Binary mode is always selected  

2. Catching **`Exception`** broadly is discouraged when:  
   A) You want to log and re-raise unknown failures at a boundary  
   B) You silently swallow all errors including `KeyboardInterrupt` and `SystemExit` unintentionally  
   C) You subclass `BaseException` for domain errors  

3. **`raise ... from e`** when re-raising helps:  
   A) Hide the original traceback  
   B) Preserve exception chaining for clearer debugging  
   C) Speed up I/O  

4. For cross-platform paths, **`pathlib.Path`** is preferred over manual string concatenation because:  
   A) It understands OS-specific separators and semantics  
   B) It removes the need for any permissions  
   C) It encrypts files automatically  

5. The **`else` clause on a `try` block** runs when:  
   A) Any exception occurs  
   B) No exception occurred in the `try` suite  
   C) Only `finally` was used  

6. Opening text files with **explicit `encoding="utf-8"`** is recommended because:  
   A) UTF-8 is always the OS default on every platform  
   B) It avoids relying on locale-dependent default encodings that differ by OS  
   C) It disables decoding errors  

7. **`Path.read_text`** vs **`Path.read_bytes`**:  
   A) They are identical  
   B) `read_text` returns a decoded `str`; `read_bytes` returns raw `bytes`  
   C) `read_bytes` cannot read files  

8. **`finally` in try/finally** runs:  
   A) Only if no exception occurred  
   B) Whether or not an exception occurred, after `try`/`except`/`else` handling  
   C) Never if `return` occurs in `try`  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **A** · 5. **B** · 6. **B** · 7. **B** · 8. **B**
