import type { TrainersByClientList } from "@/lib/trainers-by-client";
import { PORTAL_CARD, PORTAL_TABLE_FRAME, PORTAL_TABLE_HEAD_ROW } from "@/lib/portal-ui-classes";

const cardClass = PORTAL_CARD;

type Props = {
  data: TrainersByClientList | null;
  error: string | null;
  /** Accessible id for the section heading */
  headingId: string;
};

type TableRow = {
  key: string;
  clientName: string;
  name: string;
  email: string;
  isPlaceholder: boolean;
};

function buildTableRows(data: TrainersByClientList): TableRow[] {
  const rows: TableRow[] = [];

  for (const section of data.byClient) {
    if (section.trainers.length === 0) {
      rows.push({
        key: `empty-${section.clientMasterId}`,
        clientName: section.clientName,
        name: "No trainer assigned",
        email: "—",
        isPlaceholder: true,
      });
    } else {
      for (const t of section.trainers) {
        rows.push({
          key: t.id,
          clientName: section.clientName,
          name: t.name?.trim() || "—",
          email: t.email,
          isPlaceholder: false,
        });
      }
    }
  }

  for (const t of data.unassigned) {
    rows.push({
      key: t.id,
      clientName: "No client assigned",
      name: t.name?.trim() || "—",
      email: t.email,
      isPlaceholder: false,
    });
  }

  rows.sort((a, b) => {
    const c = a.clientName.localeCompare(b.clientName, undefined, { sensitivity: "base" });
    if (c !== 0) return c;
    if (a.isPlaceholder !== b.isPlaceholder) return a.isPlaceholder ? 1 : -1;
    return a.email.localeCompare(b.email, undefined, { sensitivity: "base" });
  });

  return rows;
}

export function TrainersByClientSection({ data, error, headingId }: Props) {
  const rows = data ? buildTableRows(data) : [];

  return (
    <section className={cardClass} aria-labelledby={headingId}>
      <h2 id={headingId} className="text-lg font-semibold text-slate-900">
        Trainers by client
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        All trainer accounts in one list: each row shows the client (or unmapped) and the trainer.
      </p>
      {error ? (
        <p className="mt-4 text-sm text-rose-700" role="alert">
          {error}
        </p>
      ) : data ? (
        rows.length === 0 ? (
          <p className="mt-4 text-sm text-slate-600">No trainer accounts in the system.</p>
        ) : (
          <div className={`mt-4 ${PORTAL_TABLE_FRAME}`}>
            <table className="w-full min-w-[min(100%,32rem)] border-collapse text-left text-sm">
              <thead>
                <tr className={PORTAL_TABLE_HEAD_ROW}>
                  <th className="px-4 py-3 font-semibold text-slate-800">Client</th>
                  <th className="px-4 py-3 font-semibold text-slate-800">Name</th>
                  <th className="px-4 py-3 font-semibold text-slate-800">Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D0D3E7]">
                {rows.map((row) => (
                  <tr key={row.key} className="text-slate-700">
                    <td className="px-4 py-3 font-medium text-[#b23d1e]">{row.clientName}</td>
                    <td
                      className={`px-4 py-3 font-medium text-slate-900 ${row.isPlaceholder ? "text-slate-500 italic" : ""}`}
                    >
                      {row.name}
                    </td>
                    <td className="px-4 py-3">
                      {row.isPlaceholder ? (
                        <span className="text-slate-400">{row.email}</span>
                      ) : (
                        <code className="rounded bg-[#F7F7FF] px-1.5 py-0.5 text-xs text-slate-800">
                          {row.email}
                        </code>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : null}
    </section>
  );
}
