"use client";

import type { DashboardAnalytics } from "@/lib/dashboard-analytics";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PORTAL_CARD } from "@/lib/portal-ui-classes";

const teal = "#00A89E";
const violet = "#5b4b96";
const muted = "#94a3b8";

type Props = {
  data: DashboardAnalytics;
};

export function DashboardAnalyticsCharts({ data }: Props) {
  const traineeAssignmentRows = [
    {
      name: "Assigned to a plan",
      value: data.traineesAssignedToPlans,
      fill: teal,
    },
    {
      name: "Not assigned yet",
      value: data.traineesWithoutAssignedPlan,
      fill: muted,
    },
  ];

  const courseSummaryRow = [{ name: "Training plans (courses)", value: data.totalCourses, fill: violet }];

  const exerciseSummaryRow = [
    { name: "Exercises (all plans)", value: data.totalExercises, fill: teal },
  ];

  const tooltipStyle = {
    borderRadius: "12px",
    border: "1px solid #d8d0c4",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className={PORTAL_CARD}>
        <h2 className="text-lg font-semibold text-slate-900">Trainees assigned to a training plan</h2>
        <p className="mt-1 text-sm text-slate-600">
          Trainees listed on at least one training plan vs. trainees not assigned to any plan yet.
        </p>
        <div className="mt-4 h-72 w-full min-h-[18rem] min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={traineeAssignmentRows} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d8d0c4" />
              <XAxis dataKey="name" tick={{ fill: "#475569", fontSize: 11 }} interval={0} />
              <YAxis allowDecimals={false} tick={{ fill: "#475569", fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={56}>
                {traineeAssignmentRows.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={PORTAL_CARD}>
        <h2 className="text-lg font-semibold text-slate-900">Courses in the application</h2>
        <p className="mt-1 text-sm text-slate-600">
          Total training plans on the platform (each plan represents a course track).
        </p>
        <div className="mt-4 h-72 w-full min-h-[18rem] min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={courseSummaryRow} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d8d0c4" />
              <XAxis dataKey="name" tick={{ fill: "#475569", fontSize: 11 }} interval={0} />
              <YAxis allowDecimals={false} tick={{ fill: "#475569", fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={72}>
                <Cell fill={violet} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={PORTAL_CARD}>
        <h2 className="text-lg font-semibold text-slate-900">{data.usersByRoleTitle}</h2>
        <p className="mt-1 text-sm text-slate-600">{data.usersByRoleDescription}</p>
        <div className="mt-4 h-72 w-full min-h-[18rem] min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.usersByRole} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d8d0c4" />
              <XAxis dataKey="name" tick={{ fill: "#475569", fontSize: 11 }} interval={0} />
              <YAxis allowDecimals={false} tick={{ fill: "#475569", fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={56}>
                {data.usersByRole.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={PORTAL_CARD}>
        <h2 className="text-lg font-semibold text-slate-900">Exercises across plans</h2>
        <p className="mt-1 text-sm text-slate-600">
          Total exercise items linked to training plans (modules / lessons).
        </p>
        <div className="mt-4 h-72 w-full min-h-[18rem] min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={exerciseSummaryRow} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d8d0c4" />
              <XAxis dataKey="name" tick={{ fill: "#475569", fontSize: 11 }} interval={0} />
              <YAxis allowDecimals={false} tick={{ fill: "#475569", fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={72}>
                <Cell fill={teal} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={`${PORTAL_CARD} lg:col-span-2`}>
        <h2 className="text-lg font-semibold text-slate-900">New training plans over time</h2>
        <p className="mt-1 text-sm text-slate-600">Plans created in the last six months.</p>
        <div className="mt-4 h-72 w-full min-h-[18rem] min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.courseCountsByMonth} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d8d0c4" />
              <XAxis dataKey="label" tick={{ fill: "#475569", fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fill: "#475569", fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" name="New plans" fill={teal} radius={[8, 8, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
