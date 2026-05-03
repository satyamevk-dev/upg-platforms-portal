"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PORTAL_CARD } from "@/lib/portal-ui-classes";

type ExerciseProgressPoint = {
  date: string;
  score: number;
};

type ExerciseProgressChartProps = {
  exerciseName: string;
  data: ExerciseProgressPoint[];
};

export default function ExerciseProgressChart({
  exerciseName,
  data,
}: ExerciseProgressChartProps) {
  return (
    <div className={PORTAL_CARD}>
      <h2 className="text-lg font-semibold text-slate-900">Exercise progress</h2>
      <p className="mt-1 text-sm text-slate-600">
        Performance trend for <span className="font-semibold text-slate-800">{exerciseName}</span>
      </p>
      <div className="mt-4 h-72 w-full min-h-[18rem] min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d8d0c4" />
            <XAxis dataKey="date" tick={{ fill: "#475569", fontSize: 12 }} />
            <YAxis tick={{ fill: "#475569", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #d8d0c4",
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#00A89E"
              strokeWidth={3}
              dot={{ fill: "#5b4b96", r: 4, stroke: "#fff", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "#5b4b96" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
