# Module: Concurrency & I/O patterns

**Track:** Intermediate · **Module ID:** `pyi-concurrency-io`

## Overview

This module aligns with the training library topic **Concurrency & I/O patterns**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- Blocking I/O vs. CPU-bound work
- threading for I/O-bound tasks (GIL awareness)
- multiprocessing when parallelism matters
- asyncio intro: event loop, async def, await

---

## Lesson 1: Blocking I/O vs. CPU-bound work

- **I/O-bound** tasks spend time waiting on network/disk—threads or async can help; **CPU-bound** numeric work needs **processes** or native extensions because **GIL** prevents true parallel threads for pure Python bytecode crunching.
- Profile before choosing: `time.sleep` benchmarks are not CPU benchmarks—use **`time.perf_counter`** and realistic payloads.
- Prerequisites: stdlib basics; awareness that “more threads” is not free memory or context-switch wise.

## Lesson 2: `threading` for concurrent I/O

- **Happy path**: use **`concurrent.futures.ThreadPoolExecutor`** map for bounded worker pools; guard shared mutable state with **`queue.Queue`**, not list append races.
- Know **daemon threads** vs. non-daemon shutdown behavior—do not lose telemetry on abrupt interpreter exit.
- Checkpoints: stress test shows bounded latency without unbounded thread explosion.

## Lesson 3: `multiprocessing` and `asyncio` intro

- **`ProcessPoolExecutor`** for parallel CPU in separate interpreters—watch **picklability** of tasks and **memory** duplication of large read-only data (consider **`initializer`** with globals).
- **`async def` / `await`** runs on an **event loop**—great for many concurrent waits; do not call blocking socket code inside hot async paths without **`asyncio.to_thread`** offload.
- Pitfalls: mixing threads + fork on some platforms; async tasks leaking **cancellation** handling.

## Lesson 4: Model selection and handoff to advanced async

- **Done** when service README documents **why** thread vs. process vs. async was chosen with measured evidence.
- Document **timeouts** on all external calls (`requests` timeouts, `asyncio.wait_for`).
- Handoff: **async IO at scale** advanced module for cancellation, backpressure, and testing async.

## Lesson 5: Lab—queues, executors, and `asyncio.to_thread`

- Build a **`ThreadPoolExecutor`** that submits ten URL fetches (mock with `time.sleep`) and measure wall time vs sequential—respect rate limits in real exercises.
- In asyncio, offload a blocking **`time.sleep(1)`** with **`await asyncio.to_thread(time.sleep, 1)`** and verify other tasks still progress (with prints or counters).
- Use **`asyncio.Queue`** with producer/consumer tasks—set **`maxsize`** and observe backpressure when consumers are slow.

## Lesson 6: Anti-patterns in concurrency

- **Shared mutable globals** between threads without locks—data races; prefer queues or immutable messages.
- **`run_in_executor` without bounding** executor size—can spawn thousands of threads under burst load.
- Mixing **`fork`** after threads on Linux with certain libraries—document platform hazards; prefer `spawn` start method when required.

---

## Key takeaways

- **GIL means threads help I/O, not CPU Python**—reach for processes or vectorized/native code for hot numeric loops.
- **Executors bound concurrency**—unbounded `threading.Thread` per request is a load test against yourself.
- **Async is cooperative**—one blocking call stalls the whole loop unless isolated.

---

## Quiz

1. The **GIL** (Global Interpreter Lock) most directly affects:  
   A) File encoding choices  
   B) Parallel execution of CPU-bound pure Python bytecode across threads  
   C) JSON parsing only  

2. **`ThreadPoolExecutor`** is often a good fit for:  
   A) CPU-bound numeric crunching in pure Python across many cores without processes  
   B) Running multiple blocking I/O tasks concurrently with a bounded pool  
   C) Replacing `asyncio` always  

3. **`async def` functions** are executed by:  
   A) The operating system scheduler directly without an event loop  
   B) An asyncio (or compatible) event loop that drives tasks between await points  
   C) The GIL only  

4. **`multiprocessing`** is commonly chosen when:  
   A) You need true parallelism on CPU-bound Python work across cores  
   B) You only print logs  
   C) You want shared mutable Python objects without any synchronization  

5. Calling **blocking** socket code directly inside a tight **asyncio** event loop can:  
   A) Improve throughput always  
   B) Stall other coroutines until the blocking call completes  
   C) Automatically become non-blocking  

6. **`asyncio.to_thread`** (3.9+) is used to:  
   A) Replace all `await` keywords  
   B) Run a blocking callable in a default thread pool without blocking the event loop  
   C) Delete tasks  

7. **`asyncio.Queue`** with a **`maxsize`** helps implement:  
   A) Infinite buffering always  
   B) Backpressure between producers and consumers  
   C) CPU parallelism  

8. **`concurrent.futures.ProcessPoolExecutor`** runs work in:  
   A) The same thread as callers always  
   B) Separate interpreter processes, enabling parallel CPU for many workloads  
   C) The event loop only  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **A** · 5. **B** · 6. **B** · 7. **B** · 8. **B**
