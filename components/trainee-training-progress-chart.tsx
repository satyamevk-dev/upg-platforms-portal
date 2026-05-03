"use client";

import Link from "next/link";
import type { TraineePlanProgressChartRow } from "@/lib/trainee-dashboard-training-progress";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const teal = "#00A89E";

type TooltipPayload = {
  payload?: TraineePlanProgressChartRow;
  value?: number | string;
};

function TraineeProgressTooltipContent({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
}) {
  if (!active || !payload?.length) {
    return null;
  }
  const first = payload[0];
  const row = first.payload;
  if (!row) {
    return null;
  }
  const raw = first.value;
  const n = typeof raw === "number" ? raw : Number(raw);
  return (
    <div
      className="rounded-xl border border-[#d8d0c4] bg-white px-3 py-2 text-sm shadow-sm ring-1 ring-black/[0.03]"
      style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}
    >
      <p className="font-medium text-slate-900">{row.title}</p>
      <p className="text-slate-600">
        {Number.isFinite(n) ? n : 0}% complete ({row.modulesDone}/{row.modulesTotal} modules)
      </p>
    </div>
  );
}

type Props = {
  rows: TraineePlanProgressChartRow[];
  headingId?: string;
};

export function TraineeTrainingProgressChart({ rows, headingId = "dashboard-trainee-progress-heading" }: Props) {
  const chartData = rows.map((r) => ({
    ...r,
    label: r.titleShort,
  }));

  const chartHeightPx = Math.min(420, Math.max(220, 40 + rows.length * 48));

  return (
    <div>
      <h2 id={headingId} className="text-lg font-semibold text-slate-900">
        Training completion
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Progress across plans assigned to you (any module order counts toward completion). Open a plan from the{" "}
        <Link href="/client" className="font-medium text-[#00786f] underline underline-offset-2">
          Trainee
        </Link>{" "}
        area to continue.
      </p>

      {rows.length === 0 ? (
        <p className="mt-4 text-sm text-slate-600">
          No training plans are assigned to you yet. When your trainer assigns a plan, completion will
          appear here.
        </p>
      ) : (
        <div
          className="mt-4 w-full min-w-0"
          style={{ height: chartHeightPx }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{ top: 8, right: 24, left: 4, bottom: 8 }}
              barCategoryGap="18%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#d8d0c4" horizontal={false} />
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fill: "#475569", fontSize: 12 }}
                tickFormatter={(v) => `${v}%`}
              />
              <YAxis
                type="category"
                dataKey="label"
                width={160}
                tick={{ fill: "#475569", fontSize: 11 }}
                interval={0}
              />
              <Tooltip content={<TraineeProgressTooltipContent />} />
              <Bar dataKey="percentComplete" fill={teal} radius={[0, 8, 8, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
