import type { LinuxTopic } from "./linux-topic";

export const pythonBasicsLibrary: LinuxTopic[] = [
  {
    id: "pyb-intro",
    major: "Python introduction & setup",
    minors: [
      "What Python is used for: scripting, APIs, data, automation",
      "Installing CPython, python3 / pip3, and choosing an editor or IDE",
      "Running scripts vs. the interactive REPL",
      "PEP 8 awareness and reading tracebacks",
    ],
  },
  {
    id: "pyb-syntax",
    major: "Syntax, types & variables",
    minors: [
      "Indentation, blocks, and comments",
      "Dynamic typing, assignment, and naming conventions",
      "Numbers, strings, booleans, and None",
      "Basic operators and expressions",
    ],
  },
  {
    id: "pyb-control",
    major: "Control flow",
    minors: [
      "if / elif / else and truthiness",
      "for loops, range(), and iterating sequences",
      "while loops and break / continue",
      "match / case overview (3.10+) when available",
    ],
  },
  {
    id: "pyb-collections",
    major: "Collections & strings",
    minors: [
      "Lists: indexing, slicing, mutability, common methods",
      "Tuples and when immutability helps",
      "dict and set basics; keys and uniqueness",
      "String formatting: f-strings and basic str methods",
    ],
  },
  {
    id: "pyb-functions",
    major: "Functions & modules",
    minors: [
      "def, parameters, return values, and scope",
      "Default arguments and keyword args (avoid mutable defaults)",
      "Importing modules and packages; __name__ == \"__main__\"",
      "Docstrings and help()",
    ],
  },
  {
    id: "pyb-files-errors",
    major: "Files & error handling",
    minors: [
      "Reading and writing text files; context managers (with)",
      "Path basics and os.path vs pathlib intro",
      "try / except / else / finally",
      "Raising exceptions and common built-in types",
    ],
  },
];
