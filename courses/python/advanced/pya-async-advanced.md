# Module: Async IO at scale

**Track:** Advanced · **Module ID:** `pya-async-advanced`

## Overview

This module aligns with the training library topic **Async IO at scale**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- Tasks, gather, shields, and cancellation semantics
- Streams, protocols, and backpressure
- Integrating blocking code with executors
- Testing async code and flaky timing

---

## Lesson 1: Tasks, `gather`, cancellation, and `shield`

- **`asyncio.create_task`** schedules concurrent work; **`await asyncio.gather`** composes parallelism—know **`return_exceptions`** behavior when one failure should not cancel siblings policy-wise.
- **`asyncio.shield`** protects inner awaits from **cancellation** propagation in specific patterns—document why rare uses are justified.
- Prerequisites: intro asyncio; understanding that **CancelledError** is BaseException subclass—handle carefully, do not swallow blindly.

## Lesson 2: Streams, protocols, and backpressure

- **Happy path**: use **`StreamReader`/`StreamWriter`** or framework equivalents with **read limits** to avoid memory bombs; propagate **flow control** (`drain`) in echo servers.
- Implement **timeouts** on every external wait (`asyncio.wait_for`) with product-specific retry policy.
- Checkpoints: load test shows stable memory under slow clients; no unbounded queue growth without monitoring.

## Lesson 3: Integrating blocking code with executors

- Pitfalls: calling **`requests.get`** inside async tasks without thread offload; mixing **`run_until_complete`** in running loops; forgetting to **close** transports on shutdown.
- Use **`asyncio.to_thread`** (3.9+) or **`loop.run_in_executor`** for blocking libraries until native async clients exist.
- Rollback: if cancellation storms appear, add **structured concurrency** patterns (`TaskGroup` in 3.11+).

## Lesson 4: Testing async and flaky timing

- **Done** when **`pytest-asyncio`** (or framework) configured with **mode** documented; tests avoid real sleeps via **`asyncio.sleep(0)`** manipulation or clock fakes where possible.
- Document **graceful shutdown** integration tests hitting open sockets.
- Handoff: **platform** module for ASGI deployment concerns.

## Lesson 5: Lab—`TaskGroup` and structured concurrency

- Rewrite a script that spawns several **`create_task`** calls with manual exception handling to use **`asyncio.TaskGroup`** (3.11+)—observe first-failure cancellation behavior.
- Build a tiny TCP echo with **`StreamReader`/`StreamWriter`**—add **`readuntil` limit** and **`wait_for`** on client handler to cap abuse.
- Add **`asyncio.to_thread`** around a blocking `time.sleep(2)` call—verify the loop still schedules other coroutines concurrently.

## Lesson 6: Anti-patterns at async scale

- **`gather` without `return_exceptions` policy**—surprise partial results when one task fails and others are cancelled.
- **Unbounded `Queue`** feeding workers—no visibility until memory blows; pair with metrics and maxsize.
- **Swallowing `CancelledError`** in random `except Exception`**—breaks shutdown and structured cancellation.

---

## Key takeaways

- **Cancellation is part of the API contract**—async cleanup must be `finally` safe like sync `try/finally`.
- **Backpressure is honesty**—unbounded queues hide overload until OOM kills you.
- **Blocking calls in async loops are bugs**—offload or replace the library.

---

## Quiz

1. **`asyncio.CancelledError`** should generally be:  
   A) Silently swallowed everywhere  
   B) Allowed to propagate or handled carefully at task boundaries with cleanup in `finally`  
   C) Ignored because it is a `ValueError`  

2. **`asyncio.shield`** is used to:  
   A) Speed up CPU code  
   B) Protect an awaitable from cancellation in specific propagation scenarios (still not a security boundary)  
   C) Replace `gather` always  

3. **`await writer.drain()`** in streams helps with:  
   A) Flushing write buffers and respecting flow control / backpressure  
   B) Closing SSL always  
   C) Reading data  

4. Calling **blocking** HTTP clients directly inside hot async tasks without offload typically:  
   A) Scales perfectly  
   B) Blocks the event loop, harming concurrency  
   C) Automatically becomes async  

5. **`asyncio.wait_for(coro, timeout)`** wraps a coroutine to:  
   A) Remove timeouts  
   B) Cancel the waited task if it exceeds the timeout (subject to cancellation semantics)  
   C) Always return `None`  

6. **`asyncio.TaskGroup`** (3.11+) primarily encourages:  
   A) Ignoring task failures  
   B) Structured concurrency: child tasks scoped to a block with defined error propagation  
   C) Replacing the event loop  

7. **`asyncio.to_thread`** is appropriate for:  
   A) CPU-bound pure Python hot loops  
   B) Running blocking callables in a thread pool without blocking the event loop  
   C) Replacing `await` syntax  

8. An **`asyncio.Queue`** with **unbounded** maxsize in a producer/consumer service risks:  
   A) Faster consumers always  
   B) Memory growth if producers outpace consumers—prefer bounded queues and backpressure  
   C) Automatic load shedding  

---

## Answer key

1. **B** · 2. **B** · 3. **A** · 4. **B** · 5. **B** · 6. **B** · 7. **B** · 8. **B**
