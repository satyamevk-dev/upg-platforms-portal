# Module: Metaprogramming

**Track:** Advanced · **Module ID:** `pya-metaprogramming`

## Overview

This module aligns with the training library topic **Metaprogramming**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- Decorators: closures, functools.wraps, parameterization
- Descriptors and __get__ / __set__
- Metaclasses: when (and when not) to use them
- Import hooks and dynamic module patterns (awareness)

---

## Lesson 1: Decorators, closures, and `functools.wraps`

- Decorators are **syntactic sugar** for `f = decorator(f)`—often implemented as functions returning wrappers; use **`@functools.wraps`** to preserve metadata and typing friendliness.
- Parameterized decorators (`@retry(times=3)`) are factories returning the real decorator—mind closure variable capture timing.
- Prerequisites: functions, OOP; ability to read stack traces through wrapper layers.

## Lesson 2: Descriptors and attribute access

- **Happy path**: understand **`__get__` / `__set__` / `__delete__`** powering **`@property`**, **`classmethod`**, **`staticmethod`**; implement descriptors when you need per-attribute storage in the class dict vs. instance dict tricks.
- Document **data vs. non-data** descriptor precedence rules when mixing inheritance.
- Checkpoints: `help()` on descriptors still makes sense; no surprise infinite recursion in `__setattr__` tests.

## Lesson 3: Metaclasses—when (not) to use them

- Pitfalls: metaclasses changing **every** subclass import side effects; incompatibility when mixing multiple metaclasses; debugging difficulty for average teammate.
- Prefer **`__init_subclass__`**, **class decorators**, or **`typing`/`dataclasses`** before metaclasses unless framework author.
- Rollback: if metaclass saved ten lines but costs ten hours per onboarding, delete it.

## Lesson 4: Import hooks awareness and review

- **Done** when dynamic import patterns (`importlib`) are isolated, tested, and security-reviewed—especially if loading plugins from disk.
- Document **entry points** (`importlib.metadata`) for plugin discovery vs. ad-hoc `sys.path` hacks.
- Handoff: **performance** module profiles decorator-heavy hot paths.

## Lesson 5: Lab—class decorators and `__slots__` tradeoffs

- Write a **class decorator** `@trace_methods` that logs entry/exit for public methods—apply to a toy service class; ensure `__repr__` still works.
- Add **`__slots__`** to a high-churn data class—observe attribute error on unexpected fields (feature or foot-gun?).
- Implement a simple **lazy property** via descriptor without `@property` decorator to feel `__get__` mechanics.

## Lesson 6: Anti-patterns in metaprogramming

- Decorators that change **function signatures** without updating **`typing` stubs**—breaks mypy and IDE hints.
- **Metaclasses** to tweak one subclass—class decorators almost always suffice.
- Dynamic **`setattr` everywhere** instead of schema—makes static analysis impossible and hides typos until runtime.

---

## Key takeaways

- **Decorators should be transparent**—`wraps`, signatures, and type hints keep them maintainable.
- **Descriptors are Python’s attribute protocol**—master them before writing a metaclass.
- **Metaclasses are team-wide complexity**—default answer is “no” until proven otherwise.

---

## Quiz

1. **`@functools.wraps(wrapped)`** in a decorator primarily helps:  
   A) Speed up calls  
   B) Copy metadata like `__name__` and `__doc__` from the wrapped function onto the wrapper  
   C) Disable recursion  

2. A **descriptor** implements at least:  
   A) Only `__init__`  
   B) `__get__`, and optionally `__set__` / `__delete__`, to customize attribute access  
   C) Only async methods  

3. **Parameterized decorators** typically look like:  
   A) `@decorator` only  
   B) `@retry(times=3)` where the outer call returns the actual decorator applied to the function  
   C) Illegal syntax  

4. **Metaclasses** should be rare because they:  
   A) Always improve performance  
   B) Affect class creation globally for subclasses and can complicate debugging and composition  
   C) Cannot coexist with dataclasses  

5. **`__init_subclass__`** is often preferred over metaclasses when:  
   A) You need to hook subclass registration with less global magic  
   B) You want to delete all methods  
   C) You must patch CPython internals  

6. A **class decorator** is applied:  
   A) Only at import time to class objects—often simpler than metaclasses for cross-cutting tweaks  
   B) Never in Python  
   C) Only to modules  

7. **`__getattr__`** on a class is invoked when:  
   A) Any attribute is accessed  
   B) Normal lookup fails to find an attribute—use carefully to avoid recursion with `__getattribute__`  
   C) Only during `import`  

8. **`functools.lru_cache` as a decorator** memoizes:  
   A) All side effects safely always  
   B) Pure function results keyed by arguments—unsafe if arguments are unhashable or function has non-deterministic side effects  
   C) Only async functions  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **B** · 5. **A** · 6. **A** · 7. **B** · 8. **B**
