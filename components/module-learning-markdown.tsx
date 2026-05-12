"use client";

import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const mdComponents: Components = {
  h2: ({ children, ...props }) => (
    <h2
      className="mt-10 scroll-mt-20 border-b border-[var(--card-border)] pb-2 text-xl font-bold tracking-tight text-slate-900 first:mt-0"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="mt-8 text-lg font-semibold text-slate-900" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4 className="mt-6 text-base font-semibold text-slate-800" {...props}>
      {children}
    </h4>
  ),
  p: ({ children, ...props }) => (
    <p className="my-3 leading-relaxed text-slate-700 last:mb-0" {...props}>
      {children}
    </p>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="my-4 border-l-4 border-brand-teal bg-slate-50/90 py-2 pl-4 pr-3 text-sm leading-relaxed text-slate-600 [&_p]:my-2 [&_strong]:text-slate-800"
      {...props}
    >
      {children}
    </blockquote>
  ),
  ul: ({ children, ...props }) => (
    <ul className="my-4 list-disc space-y-2 pl-5 marker:text-[#F46036]" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="my-4 list-decimal space-y-2 pl-5 marker:font-medium marker:text-[#b23d1e]" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, className, ...props }) => (
    <li
      className={`leading-relaxed pl-0.5 [&_input[type='checkbox']]:mr-2 [&_input[type='checkbox']]:accent-[#F46036] ${className ?? ""}`}
      {...props}
    >
      {children}
    </li>
  ),
  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-slate-900" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }) => (
    <em className="italic text-slate-700" {...props}>
      {children}
    </em>
  ),
  code: ({ children, className, ...props }) => {
    const inline = !className;
    if (inline) {
      return (
        <code
          className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[0.9em] text-slate-800"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  pre: ({ children, ...props }) => (
    <pre
      className="my-4 overflow-x-auto rounded-xl border border-[var(--card-border)] bg-[#F7F7FF] p-4 font-mono text-sm text-slate-800"
      {...props}
    >
      {children}
    </pre>
  ),
  hr: (props) => <hr className="my-8 border-[var(--card-border)]" {...props} />,
};

type Props = {
  markdown: string;
  className?: string;
};

export function ModuleLearningMarkdown({ markdown, className = "" }: Props) {
  return (
    <article className={`module-learning-md max-w-none ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
        {markdown}
      </ReactMarkdown>
    </article>
  );
}
