# Module: Functions & modules

**Track:** Basic · **Module ID:** `pyb-functions`

## Overview

This module aligns with the training library topic **Functions & modules**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- def, parameters, return values, and scope
- Default arguments and keyword args (avoid mutable defaults)
- Importing modules and packages; __name__ == "__main__"
- Docstrings and help()

---

## Lesson 1: `def`, parameters, return values, scope

- Functions bundle **inputs → outputs** with a name; parameters can be positional-only, positional-or-keyword, and keyword-only (`def f(a, /, b, *, c):` in modern Python).
- **LEGB** scope rule: **L**ocal, **E**nclosing, **G**lobal, **B**uiltins—`global`/`nonlocal` declarations exist but prefer passing values explicitly when clarity wins.
- Prerequisites: collections and control flow modules.

## Lesson 2: Defaults, `*args`, `**kwargs`, and mutability trap

- **Happy path**: defaults evaluate **once** at function definition time—never use mutable defaults like `def append_item(x, items=[]):`; use `None` and assign `items = items or []` inside or `items: list | None = None`.
- `*args` collects extra positional tuple; `**kwargs` collects extra keyword dict—great for wrappers; combine with `functools.wraps` later.
- Checkpoints: `help(your_function)` shows docstring you wrote; signature readable in IDE hover.

## Lesson 3: Imports, packages, and `if __name__ == "__main__"`

- Pitfalls: **circular imports** from side effects at import time; star imports `from m import *` in production packages; running module code twice unexpectedly.
- Structure packages with **`__init__.py`** (namespace packages possible—know team standard); use **relative imports** carefully inside packages.
- Rollback: if import graph is tangled, extract **interfaces** to smaller modules before adding features.

## Lesson 4: Docstrings, `help()`, and handoff

- **Done** when public functions have **one-line summary + args/returns** in Google or NumPy style per team pick; `help()` output is acceptable to a new teammate.
- Document **entrypoint** pattern with `__main__` guard for CLI scripts.
- Handoff: **files & errors** module next—functions will gain I/O and robustness.

## Lesson 5: Lab—`*`/`**` unpacking and small CLI

- Write a function **`def move(src, dst, *, overwrite=False):`** and call it with keyword-only `overwrite`—attempt a positional call that should fail.
- Practice **unpacking** at call sites: `coords = (1, 2); plot(*coords)` and dict merges with `{**defaults, **overrides}` on a toy dict.
- Add **`if __name__ == "__main__":`** with **`argparse`** (or `sys.argv` for tiny scripts) to parse one optional flag—wire to your function.

## Lesson 6: Anti-patterns around imports and wrappers

- **Circular imports** caused by running heavy setup at import time—move side effects under `main()` or lazy functions.
- Decorators that swallow **exceptions** or strip **stack traces** without `functools.wraps`—debugging hell for callers.
- **`import module` inside hot loops**—pay import cost once at module level unless profiling proves lazy import wins.

---

## Key takeaways

- **Mutable default arguments are a foot-gun**—`None` sentinel is the boring correct pattern.
- **Imports execute code**—keep module import side effects minimal and predictable.
- **Docstrings are the cheapest API docs**—write them when you name the function, not “later.”

---

## Quiz

1. A **mutable default argument** like `def add(x, items=[]): items.append(x); return items` is dangerous because:  
   A) It raises SyntaxError  
   B) The same list object is reused across calls unless a new list is created inside  
   C) It always copies the list  

2. **`if __name__ == "__main__":`** is commonly used to:  
   A) Prevent a module from being imported  
   B) Run CLI or test code only when the file is executed as a script, not when imported  
   C) Define classes only  

3. **`return` without an expression** in a Python function returns:  
   A) `0`  
   B) `None`  
   C) An empty string always  

4. **`*args` in a function signature** collects:  
   A) Keyword arguments only  
   B) Extra positional arguments as a tuple  
   C) Global variables  

5. **LEGB** scope ordering stands for:  
   A) Local, Enclosing, Global, Builtins  
   B) List, Element, Graph, Boolean  
   C) Loop, Else, Guard, Break  

6. **Keyword-only parameters** after a `*` in the signature force callers to:  
   A) Pass everything positionally  
   B) Pass those parameters by name, improving readability for flags  
   C) Avoid default values  

7. **`**kwargs` in a function signature** collects:  
   A) Positional-only arguments  
   B) Extra keyword arguments into a dict  
   C) Global environment variables  

8. **`nonlocal x`** is used to:  
   A) Import modules  
   B) Assign to a name in an enclosing (non-global) scope from a nested function  
   C) Delete builtins  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **B** · 5. **A** · 6. **B** · 7. **B** · 8. **B**
