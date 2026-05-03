import type { LinuxTopic } from "./linux-topic";

export const pythonIntermediateLibrary: LinuxTopic[] = [
  {
    id: "pyi-oop",
    major: "Object-oriented Python",
    minors: [
      "Classes, instances, __init__, and self",
      "Inheritance, method resolution, and super()",
      "Properties, class vs. static methods (overview)",
      "Special methods (__str__, __repr__, basic protocols)",
    ],
  },
  {
    id: "pyi-comprehensions",
    major: "Iterators, comprehensions & generators",
    minors: [
      "List, dict, and set comprehensions",
      "Generator expressions and lazy evaluation",
      "yield and simple generator functions",
      "itertools patterns you reach for often",
    ],
  },
  {
    id: "pyi-env-packages",
    major: "Environments & packaging",
    minors: [
      "venv / virtualenv; activating and isolation",
      "pip install, requirements files, and version pins",
      "pyproject.toml and modern packaging layout (awareness)",
      "Dependency conflicts and reproducible installs",
    ],
  },
  {
    id: "pyi-stdlib",
    major: "Standard library essentials",
    minors: [
      "pathlib for filesystem work",
      "json, csv, and config-style data",
      "datetime, time zones (awareness), and formatting",
      "logging instead of print in real tools",
    ],
  },
  {
    id: "pyi-testing",
    major: "Testing & quality",
    minors: [
      "pytest or unittest: structure and discovery",
      "Fixtures, parametrization, and markers (pytest)",
      "Mocking external I/O at boundaries",
      "linters and formatters (ruff, black) in a team workflow",
    ],
  },
  {
    id: "pyi-concurrency-io",
    major: "Concurrency & I/O patterns",
    minors: [
      "Blocking I/O vs. CPU-bound work",
      "threading for I/O-bound tasks (GIL awareness)",
      "multiprocessing when parallelism matters",
      "asyncio intro: event loop, async def, await",
    ],
  },
];
