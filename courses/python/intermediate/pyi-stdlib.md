# Module: Standard library essentials

**Track:** Intermediate · **Module ID:** `pyi-stdlib`

## Overview

This module aligns with the training library topic **Standard library essentials**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- pathlib for filesystem work
- json, csv, and config-style data
- datetime, time zones (awareness), and formatting
- logging instead of print in real tools

---

## Lesson 1: `pathlib`, `json`, and `csv`

- Prefer **`Path`** APIs for filesystem traversal, globbing, and atomic-ish writes (`write_text` with temp-rename patterns when needed); pair with **`json.load/dump`** using explicit **`encoding`**.
- **`csv.DictReader`** maps rows to dicts—great for ad-hoc ETL; mind **dialect** and **newline** handling on Windows.
- Prerequisites: files & errors module; small sample files in repo for exercises.

## Lesson 2: `datetime`, time zones, and formatting

- **Happy path**: store **UTC** internally as **aware** `datetime` objects (`timezone.utc`) or ISO strings; convert at UI edges with **`zoneinfo`** (3.9+) or `dateutil` if legacy.
- Format with **`datetime.isoformat()`** or **`strftime`** patterns documented per API contract—never ambiguous `MM/DD` in logs without timezone.
- Checkpoints: unit tests cover DST edge cases if your domain requires local wall times.

## Lesson 3: `logging` configuration and structured fields

- Replace **`print`** in services with **`logging.getLogger(__name__)`**; configure **handlers** once at startup (`dictConfig` or `basicConfig` only in tiny tools).
- Use **`extra={}`** or `structlog` patterns if JSON logs required downstream—keep messages **constant** with variable fields in structured payload.
- Pitfalls: root logger at **DEBUG** in prod; logging secrets; **string formatting** in message even when level disabled—use lazy `%s` style or `logger.debug("x=%s", x)`.

## Lesson 4: Batteries-included handoff

- **Done** when team **style guide** lists preferred stdlib modules for URL parsing (`urllib.parse`), secrets (`secrets` module), and hashing (`hashlib`) vs. rolling crypto.
- Document **stdlib vs. dependency** decision matrix (when to add `requests`, `pydantic`, etc.).
- Handoff: **testing** module exercises logging capture; **typing** advanced module types these APIs.

## Lesson 5: Lab—`logging` handlers, `tempfile`, and `subprocess` safety

- Configure **`dictConfig`** with separate **console** and **file** handlers; emit JSON to file and human text to console in lab.
- Use **`tempfile.TemporaryDirectory()`** context manager for integration tests writing files—prove cleanup on exception path.
- Run **`subprocess.run([...], check=True, capture_output=True, text=True)`** on `echo`—then demonstrate failure path with non-zero exit and captured stderr.

## Lesson 6: Anti-patterns in stdlib-heavy scripts

- **`logging.basicConfig` in every module**—only the app entrypoint should configure root handlers; libraries use named loggers only.
- **`subprocess` with `shell=True`** and user-influenced strings—shell injection; use argv lists.
- **`datetime.utcnow()`** for new code without tz awareness—prefer timezone-aware patterns from earlier lessons when modeling real-world times.

---

## Key takeaways

- **`pathlib` + explicit encoding** prevents whole classes of cross-platform text bugs.
- **Timezone-aware datetimes** are non-negotiable for distributed systems—naive `datetime` is a bug magnet.
- **`logging` is an observability interface**—configure once, call everywhere with discipline.

---

## Quiz

1. **`pathlib.Path.read_text(encoding="utf-8")`** is important because:  
   A) It always deletes the file after reading  
   B) It avoids relying on the platform default encoding for text files  
   C) It encrypts the file  

2. Storing instants in **UTC** internally is recommended because:  
   A) UTC has no leap seconds  
   B) It simplifies comparisons, sorting, and conversion to local display at boundaries  
   C) Python cannot parse other zones  

3. **`logging.getLogger(__name__)`** convention helps:  
   A) Disable all logs  
   B) Create hierarchical logger names mirroring package structure for filterable logs  
   C) Print faster than `print`  

4. **`json.dumps`** vs **`json.dump`**:  
   A) They are identical  
   B) `dumps` returns a string; `dump` writes to a file-like object  
   C) `dump` cannot handle dicts  

5. **`csv.DictReader`** yields each row as:  
   A) A tuple only  
   B) A dict mapping header names to cell strings  
   C) A bytes object always  

6. **`subprocess.run(..., shell=False)`** with a **list argv** helps mitigate:  
   A) Faster imports  
   B) Shell injection compared to concatenated shell strings  
   C) JSON parsing errors  

7. **`tempfile.TemporaryDirectory`** is preferred over manual **`/tmp`** paths because:  
   A) It always uses global shared names  
   B) It creates a unique directory and cleans it up on context exit  
   C) It cannot work on Windows  

8. **`logging.config.dictConfig`** is used to:  
   A) Replace `try`/`except`  
   B) Configure loggers, handlers, and formatters declaratively at startup  
   C) Delete log files automatically  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **B** · 5. **B** · 6. **B** · 7. **B** · 8. **B**
