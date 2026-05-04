# Module: Iterators, comprehensions & generators

**Track:** Intermediate · **Module ID:** `pyi-comprehensions`

## Overview

This module aligns with the training library topic **Iterators, comprehensions & generators**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- List, dict, and set comprehensions
- Generator expressions and lazy evaluation
- yield and simple generator functions
- itertools patterns you reach for often

---

## Lesson 1: List, dict, and set comprehensions

- Comprehensions `[expr for x in it if cond]` are concise and often faster than repeated `append` in CPython—keep **readable**: nested comprehensions beyond two levels usually want a plain loop.
- **Dict comprehensions** `{k: v for ...}` and **set comprehensions** `{expr for ...}` follow the same scoping rules—watch for leaking loop variables in older Python (3.12+ improvements aside, still be clear).
- Prerequisites: control flow and collections modules.

## Lesson 2: Generator expressions and lazy evaluation

- **Happy path**: `(expr for x in it)` builds a **generator object**—iterate once, low memory for pipelines feeding `sum()`, `any()`, `next()`.
- Chain with **`yield from`** inside generator functions for readable delegation (later patterns).
- Checkpoints: you can explain why a second iteration over the same generator yields nothing without recreation.

## Lesson 3: `yield`, generator functions, and `itertools`

- **`yield`** pauses function state—implements iterators manually; combine with **`itertools.chain`, `groupby`, `islice`** for common patterns instead of reinventing wheels.
- Pitfalls: mixing **return** with value in Python 3 generator (`StopIteration` payload) confusion—prefer explicit sentinels; holding huge **internal stacks** in recursive generators without `yield from` optimization awareness.
- Rollback: when comprehension becomes unreadable, refactor to **helper generator** with a name.

## Lesson 4: Style limits and handoff

- **Done** when team lint rule caps **comprehension complexity** or reviewers enforce “no triple nested.”
- Document iterator **consumption** contracts in public APIs (one-shot vs. reiterable).
- Handoff: **stdlib itertools deep usage** optional; next module **environments & packaging** for shipping tools.

## Lesson 5: Lab—`yield from`, tee, and pipeline style

- Chain generators with **`yield from inner_gen()`** to keep call stacks shallow; compare readability vs. manual `for x in inner: yield x`.
- Use **`itertools.tee`** sparingly on large streams—understand memory tradeoffs; often **`itertools.tee(it, 2)`** duplicates storage.
- Build a three-stage pipeline: read lines → parse → aggregate counts using **generator functions only**—measure peak RSS qualitatively in lab.

## Lesson 6: Anti-patterns with generators and comprehensions

- Side effects inside comprehensions (`[log(x) or x for x in xs]`)—hard to debug; use explicit loops when I/O happens.
- Returning a **generator** where callers expect a **reusable list**—document one-shot contracts or materialize intentionally.
- **Nested comprehensions** beyond two levels without names—future readers cannot parse intent.

---

## Key takeaways

- **Generators trade memory for single-pass discipline**—know who consumes them and when.
- **Comprehensions are not a code golf license**—clarity still beats cleverness in reviews.
- **`itertools` is standard library gold**—read the docs once, reuse forever.

---

## Quiz

1. A **generator expression** `(x * 2 for x in range(3))` returns:  
   A) A list  
   B) A generator object that yields values lazily  
   C) A tuple immediately  

2. **List comprehensions** are often preferred over building with repeated **`append`** because:  
   A) They are always faster in every scenario  
   B) They are concise and typically implemented efficiently in CPython for simple cases  
   C) They cannot include `if` filters  

3. After exhausting a **generator**, calling **`next()`** again typically:  
   A) Restarts from the beginning automatically  
   B) Raises `StopIteration` unless a new generator is created  
   C) Returns `None` silently always  

4. **`yield` in a function** makes that function:  
   A) A normal function returning `None` only  
   B) A generator function whose invocation returns a generator iterator  
   C) A class decorator  

5. **`itertools.islice`** is useful to:  
   A) Mutate lists in place  
   B) Slice an iterator without converting the whole iterable to a list first  
   C) Sort arbitrary iterators with O(1) memory always  

6. **`yield from`** in a generator is mainly for:  
   A) Deleting iterators  
   B) Delegating iteration to another iterable or generator without manual forward loop  
   C) Converting bytes to str  

7. **`itertools.groupby`** requires its input to be:  
   A) Unsorted always  
   B) Sorted by the same key function you group on—otherwise groups restart unexpectedly  
   C) Only tuples  

8. A **dict comprehension** `{k: v for k, v in ... if cond}` builds:  
   A) A list  
   B) A dict in one expression  
   C) A set of keys only always  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **B** · 5. **B** · 6. **B** · 7. **B** · 8. **B**
