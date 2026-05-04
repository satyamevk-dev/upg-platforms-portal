# Module: Python introduction & setup

**Track:** Basic · **Module ID:** `pyb-intro`

## Overview

This module aligns with the training library topic **Python introduction & setup**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- What Python is used for: scripting, APIs, data, automation
- Installing CPython, python3 / pip3, and choosing an editor or IDE
- Running scripts vs. the interactive REPL
- PEP 8 awareness and reading tracebacks

---

## Lesson 1: Where Python fits—scripting, APIs, data, automation

- Map common uses: **glue scripts** and CLIs, **HTTP services** (WSGI/ASGI), **data** pipelines and notebooks, **automation** around cloud APIs—same language, different packaging and runtime expectations.
- Understand **CPython** vs. other implementations (PyPy, MicroPython) for this track—default to CPython unless your org standard says otherwise.
- Prerequisites: a supported **Python 3.x** install, a terminal, and permission to create files in a practice directory.

## Lesson 2: Installing CPython, `python3`, `pip`, and your editor

- **Happy path**: install from python.org, OS packages, or **pyenv**/asdf; verify `python3 --version` and `python3 -m pip --version`; pick an editor with **syntax highlighting** and optional **debugger** (VS Code, PyCharm, Neovim—team choice).
- Prefer **`python3 -m pip install ...`** over bare `pip` when multiple Pythons exist on one machine.
- Checkpoints: `python3 -c "import sys; print(sys.executable)"` points at the interpreter you think you are using.

## Lesson 3: Scripts vs. REPL, venv preview, and PEP 8

- Pitfalls: pasting secrets into **REPL** history; mixing **system** Python installs with project deps; ignoring **line length** and **import** order until code review hurts.
- Skim **PEP 8** for naming (`snake_case` functions, `CapWords` classes) and adopt **ruff** or **flake8** early if the team agrees.
- Rollback mindset: if `pip` broke user site-packages, recreate a clean **venv** (covered deeply in the environments module).

## Lesson 4: Reading tracebacks and handoff to syntax

- **Done** when you can read a **traceback** bottom-up: exception type, message, your frame, caller chain; you know how to re-run with `PYTHONTRACEBACK=...` or `-X dev` when helpful.
- Document **how** your org pins Python version in README (`.python-version`, `Dockerfile`, CI image tag).
- Handoff: next module **syntax & types**—carry PEP 8 habits forward.

## Lesson 5: Lab checklist—first scripts and interpreter checks

- Create **`hello.py`**, run `python3 hello.py`, then trigger a deliberate error (`1 / 0`) and read the traceback from the exception type down to your frame.
- Run **`python3 -c "import sys; print(sys.executable, sys.version)"`** on every machine you use; paste output into your team’s onboarding doc if versions differ.
- Install a **formatter/linter stub** (`ruff --version` or `python3 -m pip show black`) so the next module’s tooling expectations are already satisfied.

## Lesson 6: Anti-patterns that burn newcomers

- Relying on **`python`** instead of **`python3`** where `python` is missing, wrong, or still Python 2—standardize the command in `README` and CI.
- Pasting **secrets** or production `.env` contents into the REPL or shared screenshots; history files and screen shares leak easily.
- Treating **Stack Overflow `pip install` one-liners** as pinned dependencies without reading versions—copy the intent, not the exact unpinned line into production repos.

---

## Key takeaways

- **Know which `python3` you run**—PATH confusion causes more “works on my machine” bugs than language features.
- **The REPL is for experiments**, not secrets; scripts and modules are where reproducibility starts.
- **Tracebacks are structured logs**—learn to read them before you learn to silence them.

---

## Quiz

1. **`python3 -m pip install package`** is often recommended over plain **`pip install`** because:  
   A) It always installs faster  
   B) It targets the same interpreter as the `python3` you invoked, reducing PATH mismatches  
   C) It disables virtual environments  

2. The **CPython** implementation is:  
   A) The reference Python interpreter written in C that most tutorials assume  
   B) A Java-only runtime  
   C) The same as MicroPython always  

3. **PEP 8** primarily describes:  
   A) Memory layout of the GC  
   B) Style conventions for readable, consistent Python code  
   C) Async networking internals  

4. A **traceback** shows:  
   A) Only the final line of your program  
   B) The exception type, message, and stack of calls leading to the error  
   C) Only import times  

5. Running a script with **`python3 script.py`** differs from pasting into the REPL mainly in:  
   A) There is no difference  
   B) Scripts run top-to-bottom as a file with `__name__` semantics; REPL is interactive line-by-line exploration  
   C) Scripts cannot import modules  

6. **`sys.executable`** is most useful for:  
   A) Deleting the interpreter  
   B) Showing which Python binary is running the current code—great when debugging “wrong pip” issues  
   C) Listing installed wheels only  

7. **`PYTHONWARNDEFAULTENCODING`** (when set) relates to:  
   A) Disabling tracebacks  
   B) Surfacing `EncodingWarning` when relying on locale-specific default encodings for open text files  
   C) Speeding up imports  

8. A sensible **onboarding** step for a new repo is:  
   A) Skip reading `README` if the folder name looks familiar  
   B) Find the documented Python version, create or activate the prescribed venv, and run the listed smoke command  
   C) Always `sudo pip install` globally first  

---

## Answer key

1. **B** · 2. **A** · 3. **B** · 4. **B** · 5. **B** · 6. **B** · 7. **B** · 8. **B**
