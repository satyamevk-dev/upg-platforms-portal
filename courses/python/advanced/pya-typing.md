# Module: Advanced typing & static analysis

**Track:** Advanced · **Module ID:** `pya-typing`

## Overview

This module aligns with the training library topic **Advanced typing & static analysis**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- Generics, TypeVar, and constrained types
- Protocols and structural subtyping
- Callable, overloads, and Literal
- mypy/pyright in CI and gradual typing strategy

---

## Lesson 1: Generics, `TypeVar`, and constrained types

- **`TypeVar`** parameterizes containers (`Stack[T]`, `ResponseT`) so static checkers catch wrong element types before runtime; use **`bound=`** to restrict to protocol or base class.
- **`Generic[T]`** base from `typing` (or built-in `list[str]` in 3.9+) ties class attributes to type parameters cleanly.
- Prerequisites: intermediate OOP; CI slot for **`mypy`/`pyright`** on a slice of the codebase.

## Lesson 2: `Protocol` and structural subtyping

- **Happy path**: define **`Protocol`** for duck-typed dependencies (`Readable`, `Cacheable`) instead of inheritance from concrete vendor classes—tests pass fake objects without subclassing everything.
- Combine with **`runtime_checkable`** sparingly for `isinstance` guards—performance and design smell if overused.
- Checkpoints: pyright strict mode passes on new modules; public APIs typed end-to-end.

## Lesson 3: `Callable`, `overload`, `Literal`, and gradual typing

- Use **`@overload`** to describe multi-signature functions to type checkers; implementation body remains untyped broadly—document why.
- **`Literal["read", "write"]`** models fixed string unions better than `str` alone.
- Pitfalls: **`Any`** creep; ignoring **`None`** returns (`Optional` discipline); mismatched **`TypedDict`** keys vs. runtime JSON.

## Lesson 4: Static analysis in CI and typing strategy

- **Done** when **`pyproject`** configures checker strictness per package; **gradual** roadmap lists modules by priority (core domain first).
- Document **`TYPE_CHECKING`** import pattern to avoid circular imports for type-only symbols.
- Handoff: **metaprogramming** module types decorators and descriptors precisely.

## Lesson 5: Lab—`TypedDict`, `NotRequired`, and `TypedDict` total

- Model JSON payloads with **`TypedDict`**; mark optional keys with **`NotRequired`** (3.11 typing) or `total=False` patterns—run **`mypy`** on sample dict literals.
- Write a **`Protocol`** for a cache interface; provide a fake in tests without subclassing Redis client.
- Experiment with **`reveal_type`** locally (then delete) to see inferred unions narrow after `isinstance` guards.

## Lesson 6: Anti-patterns in typing rollout

- Sprinkling **`Any`** to silence mypy in core domain modules—creates blind spots; prefer **`object`** + narrow casts when truly unknown.
- **`cast()` without runtime check**—lies to the type checker; pair casts with validation or tests.
- Over-complex **`Union`** chains without **`TypeAlias`** readability—extract aliases and document lifetimes.

---

## Key takeaways

- **Types are checked documentation**—they pay rent in CI, not only in editors.
- **Protocols beat inheritance for seams**—depend on behavior, not vendor class names.
- **Gradual typing beats big-bang rewrites**—tighten hotspots with real bug history first.

---

## Quiz

1. A **`Protocol`** in typing is used to describe:  
   A) Only concrete inheritance trees  
   B) Structural subtyping: “anything with these methods/attributes”  
   C) Runtime bytecode layout  

2. **`TypeVar("T")`** is primarily for:  
   A) Runtime randomization  
   B) Parameterizing generic functions/classes so static checkers relate input/output types  
   C) Replacing `def`  

3. **`@overload`** is consumed mainly by:  
   A) The CPython interpreter at runtime  
   B) Static type checkers to model multiple call signatures  
   C) `pytest` only  

4. **`Literal[3, 4]`** means:  
   A) Any integer  
   B) Exactly the values `3` or `4` at the type level  
   C) A string literal only  

5. **`from typing import TYPE_CHECKING`** helps avoid:  
   A) Writing tests  
   B) Import cycles by allowing type-only imports under a false runtime branch  
   C) Using `Protocol`  

6. **`typing.cast(T, x)`** should be used:  
   A) Whenever mypy complains without thought  
   B) Sparingly, when you have a proof `x` conforms to `T` that the checker cannot see  
   C) To convert ints to strings automatically  

7. **`Optional[X]`** is equivalent to:  
   A) `X | list`  
   B) `X | None` in modern union syntax  
   C) `Never`  

8. **`@runtime_checkable`** on a **`Protocol`** enables:  
   A) Faster attribute access always  
   B) Using `isinstance` checks against structural protocols (with limitations)  
   C) Disabling mypy  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **B** · 5. **B** · 6. **B** · 7. **B** · 8. **B**
