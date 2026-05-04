# Module: Control flow

**Track:** Basic · **Module ID:** `pyb-control`

## Overview

This module aligns with the training library topic **Control flow**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- if / elif / else and truthiness
- for loops, range(), and iterating sequences
- while loops and break / continue
- match / case overview (3.10+) when available

---

## Lesson 1: `if` / `elif` / `else` and truthiness

- Structure decisions with clear **predicates**; avoid deeply nested `if` ladders when **early returns** or small helper functions improve scanability.
- Remember **truthiness**: empty containers, zero numeric types, `None`, and custom objects with `__bool__`/`__len__` influence `if obj:`—document when you rely on it.
- Prerequisites: syntax module comfort with booleans and comparisons.

## Lesson 2: `for`, `range()`, and iterating sequences

- **Happy path**: `for item in iterable:` avoids manual index juggling; use `enumerate` when you need index + value; `range(stop)` and `range(start, stop, step)` for numeric loops.
- Prefer iterating **dict** keys/values/items directly instead of `.keys()` list copies on large dicts in Python 3.
- Checkpoints: you can predict output of `break` vs. `continue` inside nested loops with a quick sketch.

## Lesson 3: `while`, `break`, `continue`, and `match` / `case`

- Pitfalls: **`while True`** without guaranteed exit; `continue` skipping increment leading to infinite loops; **`match`** capturing patterns without understanding **guards** (`if`).
- Use **`else` on loops** sparingly—many readers forget it runs when no `break` occurs; comment when used.
- Rollback: when control flow becomes spaghetti, extract **predicate functions** named `is_*` or `should_*`.

## Lesson 4: Control-flow style handoff

- **Done** when team agrees max **nesting depth** or uses **ruff**/`pylint` rules enforcing complexity limits on new code.
- Document **`match`** minimum Python version if adopted (3.10+).
- Handoff: **collections & strings** module next—loops will consume real data structures.

## Lesson 5: Lab—`enumerate`, `zip`, and guard clauses

- Rewrite a **`for i in range(len(items)):`** loop to use **`enumerate(items)`**; confirm indexes still align when you `continue` early.
- Pair two lists with **`zip(a, b, strict=True)`** (3.10+) and observe the **`ValueError`** when lengths differ—decide whether that is a bug signal for your domain.
- Refactor a nested **`if`** pyramid into **early returns**; keep behavior identical using a short test script.

## Lesson 6: Anti-patterns in loops and `match`

- **`while True:`** loops with **`break`** only buried five levels deep—readers cannot prove termination; extract functions or add max-iteration guards for exploratory parsers.
- Using **`match`** like a giant switch on strings without **guards** or **capturing** discipline—ends unreadable; sometimes plain `if/elif` is clearer.
- Mutating a **list you are iterating** without a copy—classic skip-element bugs; snapshot with `list(items)` when removal is required.

---

## Key takeaways

- **`for` is the default loop**—`while` is for unknown iteration counts with clear progress signals.
- **`break`/`continue` change flow abruptly**—pair with comments or refactor to smaller functions when logic gets dense.
- **`match` is powerful pattern sugar**—do not hide critical business rules solely inside complex patterns.

---

## Quiz

1. **`for i in range(3):`** iterates **`i`** over:  
   A) `1, 2, 3`  
   B) `0, 1, 2`  
   C) `0, 1, 2, 3`  

2. **`continue`** in a loop:  
   A) Exits the program  
   B) Skips the rest of the current iteration and goes to the next iteration  
   C) Breaks out of all nested loops always  

3. **`enumerate(iterable)`** is useful when you need:  
   A) Only the index, never the item  
   B) Pairs of `(index, item)` while iterating  
   C) To sort the iterable in place always  

4. An **`else` clause on a `for` loop** in Python runs when:  
   A) The loop never starts  
   B) The loop completes without hitting `break`  
   C) Always before the loop body  

5. **`match` / `case`** (structural pattern matching) requires at least Python:  
   A) 3.8  
   B) 3.10  
   C) 2.7  

6. **`zip(a, b, strict=True)`** (Python 3.10+) raises **`ValueError`** when:  
   A) Iterables are empty  
   B) Iterables have unequal lengths  
   C) Elements are not integers  

7. A **`while` loop** should usually have:  
   A) No way to terminate so it runs forever usefully  
   B) A clear progress condition or documented infinite loop with internal `break` strategy  
   C) Only `continue` and never `break`  

8. **`break` in nested loops** exits:  
   A) All enclosing loops always  
   B) Only the innermost loop containing the `break`  
   C) The program  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **B** · 5. **B** · 6. **B** · 7. **B** · 8. **B**
