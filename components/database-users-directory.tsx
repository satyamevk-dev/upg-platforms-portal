import type { AuthRole } from "@prisma/client";
import { trainingPlanClientSelectLabel } from "@/lib/training-plan-clients";
import { PORTAL_TABLE_FRAME, PORTAL_TABLE_HEAD_ROW } from "@/lib/portal-ui-classes";

export type DatabaseUserDirectoryRow = {
  id: string;
  email: string;
  name: string | null;
  role: AuthRole;
  mappedClient: { id: string; name: string | null; email: string } | null;
  hasPassword: boolean;
  createdAt: string;
};

type Props = {
  users: DatabaseUserDirectoryRow[];
};

export function DatabaseUsersDirectory({ users }: Props) {
  return (
    <div className={`mt-4 ${PORTAL_TABLE_FRAME}`}>
      <table className="w-full min-w-[52rem] border-collapse text-left text-sm">
        <thead>
          <tr className={PORTAL_TABLE_HEAD_ROW}>
            <th className="px-4 py-3 font-semibold text-slate-800">Name</th>
            <th className="px-4 py-3 font-semibold text-slate-800">Email</th>
            <th className="px-4 py-3 font-semibold text-slate-800" title="Value stored in User.role">
              Role (DB)
            </th>
            <th className="px-4 py-3 font-semibold text-slate-800">Client master</th>
            <th className="px-4 py-3 font-semibold text-slate-800">Password</th>
            <th className="hidden px-4 py-3 font-semibold text-slate-800 lg:table-cell">
              Added
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#d8d0c4]">
          {users.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-6 text-sm text-slate-600">
                No users in the database yet.
              </td>
            </tr>
          ) : (
            users.map((u) => (
              <tr key={u.id} className="text-slate-700">
                <td className="px-4 py-3 font-medium text-slate-900">
                  {u.name?.trim() || "—"}
                </td>
                <td className="px-4 py-3">
                  <code className="rounded bg-[#f5f3f0] px-1.5 py-0.5 text-xs text-slate-800">
                    {u.email}
                  </code>
                </td>
                <td className="px-4 py-3">
                  <code
                    className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-slate-800"
                    title="User.role in the database"
                  >
                    {u.role}
                  </code>
                </td>
                <td className="px-4 py-3 text-xs text-slate-600">
                  {u.mappedClient ? trainingPlanClientSelectLabel(u.mappedClient) : "—"}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-600">
                  {u.hasPassword ? (
                    <span title="Password is set; the value is not stored in readable form.">
                      ••••••••
                    </span>
                  ) : (
                    <span className="text-slate-400">Not set</span>
                  )}
                </td>
                <td className="hidden px-4 py-3 text-xs text-slate-500 lg:table-cell">
                  {new Date(u.createdAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
