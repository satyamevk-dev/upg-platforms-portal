# Module: Syntax, types & variables

**Track:** Basic · **Module ID:** `pyb-syntax`

## Overview

This module aligns with the training library topic **Syntax, types & variables**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- Indentation, blocks, and comments
- Dynamic typing, assignment, and naming conventions
- Numbers, strings, booleans, and None
- Basic operators and expressions

---

## Lesson 1: Indentation, blocks, and comments

- Python uses **significant indentation** to define blocks after `: ` on `if`, `for`, `def`, etc.—mixing tabs and spaces is a syntax error in Python 3; configure your editor to **expand tabs to spaces**.
- **Comments** start with `#`; docstrings (`"""..."""`) document modules, classes, and functions for `help()`—they are not ignored like `#` lines.
- Prerequisites: intro module complete; editor showing whitespace glyphs enabled for a week.

## Lesson 2: Dynamic typing, assignment, and naming

- **Happy path**: variables are **names bound to objects**—`a = b` binds the name `a` to the same object `b` references for immutable objects like ints; for mutables, multiple names can see the same list unless you copy deliberately.
- Follow **PEP 8** naming: `snake_case` functions and variables, `CapWords` classes, `UPPER_SNAKE` constants by convention.
- Checkpoints: `id()` and `is` vs. `==` exercises in REPL build intuition without overusing `is` on small integers (implementation detail).

## Lesson 3: Numbers, strings, booleans, `None`, and operators

- Pitfalls: **`==` vs `is`** misuse; floating-point equality; **truthiness** (`if lst:`) hiding empty-but-valid states—prefer explicit `if len(lst) == 0` or `if not lst` intentionally documented.
- Know **`//`**, `%`, `**`, and augmented assignment `+=` on lists (mutating) vs. strings (rebinding).
- Rollback: when types surprise you, print `type(x)` and read docs for that type’s dunder methods later in OOP module.

## Lesson 4: Expressions, line continuation, and handoff

- **Done** when you can parse operator **precedence** with parentheses confidently and split long expressions per team line-length policy.
- Document **f-string** usage policy if mixed with `%` formatting in legacy code (style guide).
- Handoff: **control flow** module next—bring clarity on truthiness into `if` statements.

## Lesson 5: Lab—introspection without fear

- In the REPL, experiment with **`type()`**, **`isinstance()`**, and **`dir()`** on a small `list` and `str`; notice which dunders appear and skim one (`__add__` vs `__iadd__` story preview).
- Try **`a = 256; b = 256; a is b`** vs smaller integers—observe CPython’s small-int cache; **never** rely on `is` for equality of user data.
- Write five lines that deliberately mix tabs and spaces in one block to see **`TabError`** once—then configure your editor to prevent recurrence.

## Lesson 6: Anti-patterns in early assignments

- Using **`is` for numeric equality** (`x is 1000`) for integers outside the small-int cache—always use **`==`** for value comparisons unless identity is truly required.
- **`from module import *`** in application modules—pollutes namespaces and confuses static analysis; keep star imports to REPL-only exploration.
- Growing “**god variables**” reused for ten meanings—split names even if it feels verbose; future readers thank you.

---

## Key takeaways

- **Indentation is syntax**—treat the colon-block relationship as seriously as braces in other languages.
- **Names point at objects**—mutability + aliasing explains many “spooky” list bugs.
- **Explicit is better than implicit**—truthiness shortcuts are fine once the team agrees they are readable.

---

## Quiz

1. In Python 3, mixing **tabs and spaces** for indentation at the start of a line:  
   A) Is always ignored  
   B) Raises `TabError` / `IndentationError` when inconsistent  
   C) Is required  

2. After `a = []` and `b = a`, mutating **`b.append(1)`** affects **`a`** because:  
   A) Lists are copied automatically  
   B) Both names reference the same list object  
   C) Python forbids aliasing  

3. **`None`** is best thought of as:  
   A) The same as `0`  
   B) A singleton representing absence of a value  
   C) An empty string  

4. **`==` vs `is`**:  
   A) They are always interchangeable  
   B) `==` checks value equality; `is` checks object identity—use each where semantically appropriate  
   C) `is` checks value equality always  

5. **PEP 8** recommends **`snake_case`** for:  
   A) Class names primarily  
   B) Functions and variable names in most projects  
   C) Module filenames only when they contain dashes  

6. Testing **`x is None`** is idiomatic because:  
   A) `None` can have many distinct values  
   B) `None` is a singleton—identity check is clear and fast  
   C) `==` cannot compare to `None`  

7. **`a += [1]`** on a **list** `a` mutates in place, while **`a = a + [1]`** often:  
   A) Always does the same thing with identical performance  
   B) Can rebind `a` to a new list object (and differs subtly from in-place `+=` for mutables)  
   C) Is illegal syntax  

8. **`type(x)`** at the REPL is mainly useful to:  
   A) Replace `isinstance` everywhere  
   B) Discover the concrete class of an object when learning APIs  
   C) Delete attributes  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **B** · 5. **B** · 6. **B** · 7. **B** · 8. **B**
