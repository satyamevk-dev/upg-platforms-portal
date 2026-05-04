# Module: Testing & quality

**Track:** Intermediate · **Module ID:** `pyi-testing`

## Overview

This module aligns with the training library topic **Testing & quality**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- pytest or unittest: structure and discovery
- Fixtures, parametrization, and markers (pytest)
- Mocking external I/O at boundaries
- linters and formatters (ruff, black) in a team workflow

---

## Lesson 1: `pytest` discovery, tests as functions, and assertions

- **`pytest`** collects `test_*.py` files and `test_*` functions; plain **`assert`** with rich introspection beats `self.assert*` boilerplate for most new code.
- Organize tests **mirror package** (`tests/unit/test_foo.py`) vs. colocated—pick one per repo and document it.
- Prerequisites: functions and stdlib modules; CI runner access locally via `act` or remote draft PRs.

## Lesson 2: Fixtures, parametrization, and markers

- **Happy path**: **`@pytest.fixture`** sets up DB or temp dirs with **`yield`** teardown; **`@pytest.mark.parametrize`** exercises edge matrices without copy-paste tests.
- Use **markers** (`@pytest.mark.slow`) to split default CI vs. nightly suites; register markers in **`pytest.ini`** to avoid typos silently passing.
- Checkpoints: `pytest -q` green locally matches CI; flaky tests quarantined with issue links, not ignored silently.

## Lesson 3: Mocking boundaries with `unittest.mock`

- Mock **I/O boundaries** (HTTP, S3, clock) not every private function—over-mocking couples tests to implementation.
- Prefer **`pytest-mock` `mocker` fixture** or context managers `patch.object`; assert **`call_count`** and arguments on critical side effects.
- Pitfalls: patching wrong import path (`where symbol is looked up`); forgetting **`autospec=True`** leading to false greens.

## Lesson 4: Linters, formatters, and CI handoff

- **Done** when **`ruff check` + `ruff format` (or black)** run in CI on every PR; same versions pinned as dev deps.
- Document **coverage** policy if used—line coverage is a weak metric alone; pair with mutation testing only when justified.
- Handoff: **concurrency** module next—tests will need markers/timeouts for async and threads.

## Lesson 5: Lab—`pytest` plugins, tmp paths, and coverage discipline

- Enable **`pytest-cov`** on a toy package; inspect HTML report—identify **false confidence** lines (branches never asserted).
- Use **`tmp_path` fixture** instead of manual `/tmp` strings; assert files deleted when tests pass and fail.
- Register a **custom marker** `@pytest.mark.contract` and configure **`pytest_collection_modifyitems`** to skip contract tests by default in dev runs.

## Lesson 6: Anti-patterns in test suites

- **Order-dependent tests** that pass only when run in isolation—use random order plugin (`pytest-randomly`) periodically.
- **Mocking time** incorrectly—prefer **`freezegun`** or monkeypatch `datetime` consistently; avoid flaky sleeps.
- Giant **`conftest.py`** globals—split fixtures by domain package to keep discovery fast and intent clear.

---

## Key takeaways

- **Tests are executable specifications**—if they are hard to write, the API probably needs redesign.
- **Fixtures encode setup truth once**—copy-paste setup is where flaky tests breed.
- **Lint/format in CI** removes style debates from human review time.

---

## Quiz

1. **`pytest` parametrization** is mainly used to:  
   A) Skip all tests  
   B) Run the same test logic with multiple input sets without duplicating functions  
   C) Replace assertions  

2. **`@pytest.fixture`** functions typically provide:  
   A) Only global variables  
   B) Setup/teardown resources injected into tests as arguments  
   C) Production configuration only  

3. When patching, you should patch:  
   A) Always the definition site  
   B) The name as used in the module under test (where it is looked up), which may differ from definition site  
   C) Random modules  

4. **`assert` in pytest tests** is preferred over many `unittest` `assert*` methods because:  
   A) Assertions are removed in optimized bytecode always  
   B) pytest rewrites asserts to provide detailed failure introspection  
   C) pytest forbids `assert`  

5. Registering custom **`pytest` markers** in **`pytest.ini`** helps:  
   A) Speed up Python interpreter startup  
   B) Fail fast on unknown marker names instead of silently ignoring typos  
   C) Disable plugins  

6. The **`tmp_path` fixture** provides:  
   A) A permanent `/tmp` directory shared by all tests  
   B) A `pathlib.Path` to a per-test temporary directory cleaned up by pytest  
   C) A database connection  

7. **`pytest.raises(ExpectedError)`** context manager asserts that:  
   A) No exception occurs  
   B) A block raises a specific exception type (and can inspect it via `as exc`)  
   C) Tests are skipped  

8. **`autospec=True` on `patch`** helps mocks:  
   A) Run faster always  
   B) Match the real object's signature, catching typos in mocked method names  
   C) Disable assertions  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **B** · 5. **B** · 6. **B** · 7. **B** · 8. **B**
