import type { LinuxTopic } from "./linux-topic";

export const pythonAdvancedLibrary: LinuxTopic[] = [
  {
    id: "pya-typing",
    major: "Advanced typing & static analysis",
    minors: [
      "Generics, TypeVar, and constrained types",
      "Protocols and structural subtyping",
      "Callable, overloads, and Literal",
      "mypy/pyright in CI and gradual typing strategy",
    ],
  },
  {
    id: "pya-metaprogramming",
    major: "Metaprogramming",
    minors: [
      "Decorators: closures, functools.wraps, parameterization",
      "Descriptors and __get__ / __set__",
      "Metaclasses: when (and when not) to use them",
      "Import hooks and dynamic module patterns (awareness)",
    ],
  },
  {
    id: "pya-performance",
    major: "Performance & the CPython runtime",
    minors: [
      "Profiling: cProfile, sampling, and interpreting hot paths",
      "GIL implications and choosing processes vs. threads vs. async",
      "C extensions, Cython, or Rust bindings (tradeoffs)",
      "Memory views, buffers, and large-data pitfalls",
    ],
  },
  {
    id: "pya-async-advanced",
    major: "Async IO at scale",
    minors: [
      "Tasks, gather, shields, and cancellation semantics",
      "Streams, protocols, and backpressure",
      "Integrating blocking code with executors",
      "Testing async code and flaky timing",
    ],
  },
  {
    id: "pya-security",
    major: "Security & supply chain",
    minors: [
      "Secrets management and unsafe deserialization",
      "Dependency scanning and SBOM awareness",
      "Sandboxing subprocesses and validating inputs",
      "Reproducible builds and lockfiles",
    ],
  },
  {
    id: "pya-platform",
    major: "Packaging, deployment & observability",
    minors: [
      "Containers and slim base images for Python services",
      "WSGI / ASGI servers and graceful shutdown",
      "Structured logging, metrics, and tracing hooks",
      "Blue/green or canary patterns for Python rollouts",
    ],
  },
];
