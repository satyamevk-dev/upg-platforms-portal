import { passwordPolicyRequirementLines } from "@/lib/password-policy";

type Props = {
  id?: string;
  className?: string;
};

const defaultClass =
  "text-xs font-normal leading-snug text-slate-600 [&_ul]:mt-1 [&_ul]:list-disc [&_ul]:space-y-0.5 [&_ul]:pl-4";

export function PasswordRequirementsHint({ id, className }: Props) {
  const lines = passwordPolicyRequirementLines();
  return (
    <div id={id} className={className ?? defaultClass}>
      <span className="font-medium text-slate-700">Password requirements</span>
      <ul>
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  );
}
