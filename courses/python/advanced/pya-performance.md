# Module: Performance & the CPython runtime

**Track:** Advanced · **Module ID:** `pya-performance`

## Overview

This module aligns with the training library topic **Performance & the CPython runtime**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- Profiling: cProfile, sampling, and interpreting hot paths
- GIL implications and choosing processes vs. threads vs. async
- C extensions, Cython, or Rust bindings (tradeoffs)
- Memory views, buffers, and large-data pitfalls

---

## Lesson 1: Profiling with `cProfile` and sampling

- Run **`python -m cProfile -o stats.out script.py`** then analyze with **`snakeviz`/`pstats`**; distinguish **self time** vs. **cumulative** time to find hot functions, not just deep call stacks.
- Sampling profilers (`py-spy`) help production-like workloads with lower overhead—pair with **flamegraphs** for system view.
- Prerequisites: reproducible benchmark harness; avoid profiling cold start only if steady-state matters.

## Lesson 2: GIL, threads, processes, async—choosing models

- **Happy path**: validate hypothesis with **small experiment**—if CPU stays single-core pegged under threads, move work to **`ProcessPoolExecutor`**, **C extension**, **Cython**, or **vectorized NumPy** as domain dictates.
- Understand **allocator** and **GC** costs when allocating millions of tiny objects—**slots**, **`__slots__`**, or redesign data layout may beat micro-optimizing Python opcodes.
- Checkpoints: benchmark results checked into ADR with hardware notes.

## Lesson 3: `memoryview`, buffers, and big-data pitfalls

- Pitfalls: copying giant **`bytes`** slices; holding references to **mmap** buffers after close; **GIL** released in some C API calls causing surprising races in extensions.
- Use **`memoryview`** for zero-copy slices into binary protocols when safe lifetime guarantees exist.
- Rollback: if optimization harms readability, guard with **feature flag** and **metrics** proving win.

## Lesson 4: Performance review handoff

- **Done** when perf PRs include **before/after** numbers, statistical variance notes, and **regression tests** for critical paths (microbench where justified).
- Document **`PYTHONMALLOC`** / **jemalloc** decisions if infra-level changes occur.
- Handoff: **async advanced** for I/O scalability; **security** if C extensions widen attack surface.

## Lesson 5: Lab—`timeit` vs `cProfile` and a tiny benchmark harness

- Write a **`timeit`** microbench for two equivalent list-building strategies—then run **`cProfile`** on the same code to see where time actually goes (setup vs hot loop).
- Use **`py-spy record`** (if available) on a long-running script—compare wall-clock view to `cProfile` self time for one hot function.
- Document **hardware/OS/Python version** in a one-line comment in your benchmark module—reproducibility beats hero numbers.

## Lesson 6: Anti-patterns in performance work

- **Premature `ProcessPoolExecutor`** everywhere—IPC and pickling overhead can dwarf gains for small tasks.
- **Caching without TTL or bounds**—memory leaks disguised as optimizations.
- **Tuning the interpreter** before fixing **O(n²)** algorithms—profile first, rewrite second.

---

## Key takeaways

- **Profile before rewriting in Rust**—algorithmic wins beat micro-optimizations tenfold.
- **The GIL is a scheduling constraint**, not an excuse to skip measurement—threads still help blocking I/O.
- **Memory layout is performance**—fewer objects beats faster `for` loops sometimes.

---

## Quiz

1. **`cProfile`** primarily helps you:  
   A) Format code  
   B) Measure where CPU time is spent in Python functions  
   C) Remove the GIL  

2. For **CPU-bound pure Python** parallel computation on multiple cores, threads often help less than:  
   A) More `print` debugging  
   B) Processes or native extensions because of the GIL  
   C) Longer variable names  

3. **`memoryview`** is useful to:  
   A) Always deep-copy bytes  
   B) Slice binary buffers without copying when lifetimes are managed safely  
   C) Replace `list` always  

4. **Self time** vs **cumulative time** in profilers differs because:  
   A) They are identical metrics  
   B) Self time attributes time to the function itself; cumulative includes callees  
   C) Cumulative ignores recursion  

5. **Micro-optimizing** without profiling data is often:  
   A) The best first step  
   B) Guesswork that may harm readability without measurable gain  
   C) Required by PEP 8  

6. **Sampling profilers** like `py-spy` are often preferred in production-like settings because:  
   A) They always show exact line-level costs  
   B) They typically impose lower overhead than always-on deterministic profilers  
   C) They remove the GIL  

7. **`ProcessPoolExecutor`** is most appropriate when:  
   A) Every task is a few microseconds of pure Python  
   B) Work is CPU-bound and benefits from true parallelism across cores despite IPC costs  
   C) You only need cooperative I/O concurrency  

8. **Millions of small object allocations** can hurt performance partly because:  
   A) Python forbids the allocator  
   B) Allocator and GC pressure dominate—fewer/larger objects or slots may help more than opcode tweaks  
   C) The GIL is disabled  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **B** · 5. **B** · 6. **B** · 7. **B** · 8. **B**
