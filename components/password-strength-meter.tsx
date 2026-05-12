import { getPasswordStrength, type PasswordStrengthLevel } from "@/lib/password-strength";

type Props = {
  password: string;
  id?: string;
  className?: string;
};

const labelClass: Record<PasswordStrengthLevel, string> = {
  empty: "text-slate-400",
  invalid: "text-rose-700",
  weak: "text-amber-800",
  fair: "text-amber-800",
  good: "text-[#b23d1e]",
  strong: "text-[#7d2b13]",
};

const barClass: Record<PasswordStrengthLevel, string> = {
  empty: "bg-slate-300",
  invalid: "bg-rose-500",
  weak: "bg-amber-500",
  fair: "bg-amber-500",
  good: "bg-[#F46036]",
  strong: "bg-[#b23d1e]",
};

export function PasswordStrengthMeter({ password, id, className }: Props) {
  const s = getPasswordStrength(password);
  const showLabel = s.level !== "empty";

  const valueText =
    s.level === "empty" ? "Not rated yet" : s.label;

  return (
    <div
      id={id}
      className={className}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={s.percent}
      aria-valuetext={valueText}
      aria-label="Password strength"
    >
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="font-medium text-slate-600">Strength</span>
        {showLabel ? (
          <span className={`font-semibold ${labelClass[s.level]}`}>{s.label}</span>
        ) : (
          <span className="text-slate-400">—</span>
        )}
      </div>
      <div
        className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-200"
        aria-hidden
      >
        <div
          className={`h-full max-w-full rounded-full transition-[width] duration-200 ease-out ${barClass[s.level]}`}
          style={{ width: `${s.percent}%` }}
        />
      </div>
    </div>
  );
}
