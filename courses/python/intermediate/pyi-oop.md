# Module: Object-oriented Python

**Track:** Intermediate · **Module ID:** `pyi-oop`

## Overview

This module aligns with the training library topic **Object-oriented Python**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- Classes, instances, __init__, and self
- Inheritance, method resolution, and super()
- Properties, class vs. static methods (overview)
- Special methods (__str__, __repr__, basic protocols)

---

## Lesson 1: Classes, instances, `__init__`, and `self`

- **Classes** define behavior and state layout; **instances** are concrete objects; **`__init__`** initializes instance attributes; **`self`** is the instance passed explicitly by convention.
- Prefer **dataclasses** (`@dataclass`) for simple data carriers when your Python version allows—reduces boilerplate while staying explicit.
- Prerequisites: functions and collections modules; small domain model to model (e.g., `User`, `InvoiceLine`).

## Lesson 2: Inheritance, MRO, and `super()`

- **Happy path**: derive specialized types when **is-a** holds; use **`super()`** in cooperative hierarchies to respect **MRO** (Method Resolution Order) especially with multiple inheritance—keep MI shallow or prefer composition.
- Override **`__repr__`** for developer-friendly debugging; **`__str__`** for user-facing strings.
- Checkpoints: `help(YourClass)` shows docstring; `isinstance`/`issubclass` used instead of brittle type string checks.

## Lesson 3: Properties, class/static methods, special methods

- **`@property`** exposes computed attributes without breaking callers when implementation evolves; avoid turning every method into property if side effects surprise readers.
- **`@classmethod`** gets class as first arg—factories and alternate constructors; **`@staticmethod`** is rarely needed—prefer module-level function if no class coupling.
- Pitfalls: heavy work in **`__getattr__`**; infinite recursion in `__setattr__`; violating **Liskov** substitutability in overrides.

## Lesson 4: Protocols preview and handoff

- **Done** when public methods have stable names; internal helpers prefixed `_` by convention; exceptions documented.
- Sketch how **`typing.Protocol`** will formalize duck typing in advanced typing module.
- Handoff: **comprehensions & generators** or **testing** depending on curriculum emphasis.

## Lesson 5: Lab—`dataclasses`, `slots`, and `__post_init__`

- Model a **`@dataclass`** `Order` with `id`, `currency`, `lines: list[LineItem]`; implement **`__post_init__`** to validate non-empty `lines` and uppercase currency.
- Experiment with **`__slots__`** (or `slots=True` on dataclass where supported) on a high-volume object—measure memory with `sys.getsizeof` stories qualitatively.
- Write **`__eq__`-free** dataclass defaults then add a **frozen** instance used as `dict` key—observe hashability rules.

## Lesson 6: Anti-patterns in OO Python

- **God classes** with fifty methods touching every subsystem—split by responsibility or use composition with small collaborator objects.
- **Subclassing concrete utilities** (`class MyDict(dict):`) when wrapping or **`UserDict`**/`MutableMapping` delegation would isolate future changes.
- Overusing **`@property`** with hidden network I/O—surprises maintainers expecting attribute access to stay cheap.

---

## Key takeaways

- **Composition over inheritance** when behavior stacks get weird—inherit for true subtyping, not code dumping.
- **`super()` is not magic**—understand MRO before multiple inheritance in production services.
- **Special methods are API**—changing them changes how your object participates in Python protocols.

---

## Quiz

1. In instance methods, the first parameter is conventionally named:  
   A) `cls`  
   B) `self`  
   C) `this`  

2. **`@classmethod`** receives as its first argument:  
   A) The instance  
   B) The class object  
   C) The module  

3. **`super()`** is primarily used to:  
   A) Speed up all method calls  
   B) Call the next method in the MRO chain, commonly for cooperative `__init__` in subclasses  
   C) Delete base classes  

4. **`__repr__`** should ideally be:  
   A) Always identical to `__str__`  
   B) Unambiguous and helpful for developers—ideally evaluable-looking when practical  
   C) Always empty  

5. **`@property`** turns a method into:  
   A) A class attribute only  
   B) A computed attribute accessed like `obj.x` without call parentheses  
   C) A static method always  

6. A **`@dataclass(frozen=True)`** instance can be used as a **`dict` key** when:  
   A) It is always mutable  
   B) Its fields are hashable so the dataclass can be frozen and hashable  
   C) It contains lists always  

7. **`__post_init__`** on a dataclass runs:  
   A) Before any field assignment  
   B) After the generated `__init__` assigns fields—useful for validation or derived fields  
   C) Only once per program globally  

8. **`@staticmethod`** is often unnecessary because:  
   A) It cannot be called  
   B) A module-level function may express the same logic without tying it to the class namespace  
   C) It always receives `self`  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **B** · 5. **B** · 6. **B** · 7. **B** · 8. **B**
