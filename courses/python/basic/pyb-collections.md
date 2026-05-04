# Module: Collections & strings

**Track:** Basic · **Module ID:** `pyb-collections`

## Overview

This module aligns with the training library topic **Collections & strings**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- Lists: indexing, slicing, mutability, common methods
- Tuples and when immutability helps
- dict and set basics; keys and uniqueness
- String formatting: f-strings and basic str methods

---

## Lesson 1: Lists—indexing, slicing, mutability

- **Lists** are ordered, mutable sequences—**indexing** (`items[0]`, `items[-1]`) and **slicing** (`items[1:4]`, `items[:]` shallow copy) are core muscle memory.
- Mutating via **`append`**, **`extend`**, slice assignment shares performance characteristics—know **Big-O** intuition for growing lists in hot loops.
- Prerequisites: control flow module; ability to read small three-line loops that mutate lists.

## Lesson 2: Tuples, immutability, and when they help

- **Happy path**: tuples fix shape of lightweight records (`lat`, `lon`); use as **`dict` keys** when immutable; unpacking `a, b = point`.
- “Immutable” means the **tuple object** cannot change length or elements—contained mutable objects (like lists inside tuples) can still change contents.
- Checkpoints: you choose `tuple` vs. `list` consciously in function returns meant to be stable contracts.

## Lesson 3: `dict` and `set`—keys, uniqueness, ordering

- **Dict keys** must be **hashable** (immutable-ish); insertion order preserved in CPython 3.7+ as language guarantee—do not confuse with sorted order.
- **Sets** store unique elements; great for membership tests `x in seen` expected **O(1)** average; watch unhashable types (`dict` keys cannot be lists).
- Pitfalls: mutating objects used as keys in custom patterns; iterating dict while deleting without snapshot (`list(d.keys())`).

## Lesson 4: String formatting and handoff

- Prefer **`f"{name}={value}"`** for readability; know **`str.format`** and `%` for legacy maintenance.
- Document **locale** expectations when formatting numbers/dates—defer deep `datetime` to stdlib module.
- Handoff: **functions & modules** next—split growing scripts into reusable units.

## Lesson 5: Lab—`Counter`, `defaultdict`, and string drills

- From **`collections import Counter`**, count words in a small text file after **`split()`**; compare results with a manual `dict` loop for correctness.
- Build a **`defaultdict(list)`** that groups tags by category from a CSV row iterator—notice how missing keys auto-initialize.
- Practice **`str.splitlines`**, **`strip`**, **`join`**—compose a slugifier (`"  Hello World  "` → `"hello-world"`) without regex first.

## Lesson 6: Anti-patterns in collections-heavy code

- Using **`list` as a `set`** for membership (`x in huge_list`) in hot paths—switch to **`set`** when uniqueness and membership tests dominate.
- **`dict` comprehension** that calls an expensive function twice per key—assign to a variable or use walrus with care for readability.
- Assuming **`dict` order** implies **sorted** business order—sort explicitly when presenting to users or APIs.

---

## Key takeaways

- **Mutability drives aliasing bugs**—lists inside tuples still bite; default copy is often shallow.
- **`dict`/`set` membership** is your performance friend—reach for sets when uniqueness or tests dominate.
- **f-strings are not a security feature**—never `f"{user_input}"` into SQL; parameterize queries at the DB layer.

---

## Quiz

1. **Tuple unpacking** `x, y = (1, 2)` assigns:  
   A) `x` to the whole tuple  
   B) `x = 1` and `y = 2`  
   C) A syntax error always  

2. **`dict` keys** in Python must be:  
   A) Only strings  
   B) Hashable objects (immutable types like str/int/tuple of immutables, etc.)  
   C) Always lists  

3. **`set([1, 1, 2, 2])`** evaluates to something like:  
   A) `[1, 1, 2, 2]`  
   B) `{1, 2}` (unique elements, unordered display)  
   C) `(1, 2)` always  

4. An **`f"value={expr}"`** f-string:  
   A) Never calls `__format__` on objects  
   B) Evaluates `expr` at runtime and embeds its formatted representation  
   C) Is static at import time always  

5. **Slicing** `items[:]` on a list typically:  
   A) Deep-copies nested structures automatically  
   B) Produces a shallow copy of the list object (new list, same element references)  
   C) Deletes the list  

6. **`collections.Counter`** is most appropriate when you need:  
   A) Ordered insertion of unique keys only  
   B) Counts of hashable items with convenient `most_common` helpers  
   C) Fixed-size bit arrays only  

7. **`defaultdict(list)`** avoids:  
   A) Using dictionaries altogether  
   B) Manual `if key not in d: d[key] = []` before appends  
   C) Iteration  

8. For building a large string in a loop, prefer:  
   A) Repeated `s += part` for clarity always  
   B) `list` + **`str.join`** or `io.StringIO` patterns to avoid quadratic copies in hot loops  
   C) Only `print` without accumulation  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **B** · 5. **B** · 6. **B** · 7. **B** · 8. **B**
