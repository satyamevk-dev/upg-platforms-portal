# Module: Environments & packaging

**Track:** Intermediate · **Module ID:** `pyi-env-packages`

## Overview

This module aligns with the training library topic **Environments & packaging**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- venv / virtualenv; activating and isolation
- pip install, requirements files, and version pins
- pyproject.toml and modern packaging layout (awareness)
- Dependency conflicts and reproducible installs

---

## Lesson 1: `venv`, activation, and isolation

- Create envs with **`python3 -m venv .venv`** in project root; activate per OS shell; **`pip install`** targets that interpreter only—commit **dependency files**, not the `.venv` folder.
- Understand **system site-packages** isolation flags; CI should create fresh venv each run for reproducibility.
- Prerequisites: intro module; ability to run `which python` / `where python` before and after activation.

## Lesson 2: `pip`, pins, `requirements.txt`, and lockfiles

- **Happy path**: pin with **`package==1.2.3`** or migrate to **`uv.lock`/`poetry.lock`** / `pip-tools` compile workflow per team; separate **dev** vs **prod** optional deps.
- Run **`pip list --outdated`** periodically; document upgrade cadence and **CVE** response.
- Checkpoints: `pip check` reports broken dependencies; `pip freeze` from clean env matches CI.

## Lesson 3: `pyproject.toml`, build backends, and conflicts

- Pitfalls: **unbounded** `>=` pins breaking CI randomly; conflicting transitive deps; mixing **conda** and **pip** in same env without discipline.
- Know **`[project]`** metadata vs. **tool configs** (`[tool.ruff]`) living together—one file, many concerns—use sections cleanly.
- Rollback: keep **previous lockfile** in git tag; `pip install -r requirements.txt` from last green build restores known state.

## Lesson 4: Reproducible installs and handoff

- **Done** when README documents **exact** bootstrap (`uv sync`, `poetry install`, or `pip install -r requirements.txt`) and **Python version** pin.
- Document **private index** (`PIP_INDEX_URL`) usage for internal wheels.
- Handoff: **stdlib** and **testing** modules consume the environment you standardized.

## Lesson 5: Lab—`pip-tools`, constraints, and editable installs

- Compile **`requirements.in` → `requirements.txt`** with hashes using **`pip-compile`** (or `uv pip compile`) on a sample project; diff the output when bumping one library.
- Install your own package **editable** (`pip install -e .`) from a minimal `pyproject.toml`—import it from another directory to see path behavior.
- Simulate a **conflict**: pin two packages requiring incompatible transitive versions—practice reading the resolver error and choosing override vs. fork.

## Lesson 6: Anti-patterns in packaging hygiene

- **`pip install`** into the **system** Python on servers—breaks OS tooling; use venv, containers, or distro packages intentionally.
- Checking **`requirements.txt`** into Git without **pins** or hashes while claiming reproducibility—CI and prod will diverge silently.
- Mixing **conda** and **pip** in one env without documenting which tool owns upgrades—weekend pager incidents.

---

## Key takeaways

- **Virtual environments are per-project seatbelts**—global `pip install` is for throwaway tools only.
- **Locks beat wishes**—reproducible installs are a security and debugging feature, not packaging pedantry.
- **`pyproject.toml` is the modern hub**—learn its sections once, edit confidently forever.

---

## Quiz

1. **`python3 -m venv .venv`** creates:  
   A) A Docker image  
   B) An isolated Python environment directory with its own `python` and `site-packages`  
   C) A Git repository  

2. **Pinning versions** (for example `requests==2.32.3`) primarily helps:  
   A) Make installs slower  
   B) Reproduce the same dependency graph across machines and CI  
   C) Remove the need for virtual environments  

3. **`pip check`** is used to:  
   A) Format code  
   B) Verify installed packages have compatible dependencies  
   C) Compile C extensions only  

4. Storing **only** `>=` ranges without lockfiles in production apps often leads to:  
   A) Deterministic builds forever  
   B) Surprising CI or production breakage when a new compatible release introduces regressions  
   C) Faster security scanning always  

5. **`pyproject.toml`** commonly holds:  
   A) Only Docker build args  
   B) Project metadata and tool configuration sections (for example `[tool.ruff]`)  
   C) Compiled `.pyc` files  

6. **`pip install -e .`** (editable install) is useful when:  
   A) You never want imports to change  
   B) You develop a package in place and want `import mypkg` to track live edits without reinstall  
   C) You uninstall setuptools  

7. **`python3 -m pip install`** is preferable to **`pip`** alone partly because:  
   A) It always bypasses SSL  
   B) It selects the `pip` module tied to the invoked interpreter  
   C) It disables wheels  

8. A **private package index** URL is usually injected via:  
   A) Deleting `pyproject.toml`  
   B) Environment variables like `PIP_INDEX_URL` or tool-specific config—not hard-coded secrets in Git  
   C) Only `/etc/hosts` hacks  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **B** · 5. **B** · 6. **B** · 7. **B** · 8. **B**
