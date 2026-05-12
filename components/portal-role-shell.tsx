import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Tailwind max-width on the content column (e.g. max-w-4xl, max-w-6xl) */
  maxWidthClassName?: string;
  className?: string;
};

/**
 * Warm gradient page backdrop + radial accents for Trainee / Trainer / Dashboard routes.
 */
export function PortalRoleShell({
  children,
  maxWidthClassName = "max-w-4xl",
  className = "",
}: Props) {
  return (
    <div
      className={`relative flex min-h-0 flex-1 flex-col bg-gradient-to-b from-[#f5f2ec] via-[#F7F7FF] to-[#f0ebe3] px-4 py-8 sm:px-8 sm:py-12 ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage: `radial-gradient(circle at 20% 0%, rgba(0, 168, 158, 0.12) 0%, transparent 45%),
            radial-gradient(circle at 90% 10%, rgba(0, 120, 111, 0.06) 0%, transparent 40%)`,
        }}
      />
      <div className={`relative z-10 mx-auto flex w-full flex-col gap-8 ${maxWidthClassName}`}>
        {children}
      </div>
    </div>
  );
}
