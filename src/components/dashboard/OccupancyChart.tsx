"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface Props {
  data: Array<{ label: string; am: number; pm: number }>;
}

export function OccupancyChart({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ocupación del mes</CardTitle>
        <CardDescription>Bloques AM/PM ocupados por día</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="label" stroke="var(--foreground-secondary)" fontSize={12} />
            <YAxis
              stroke="var(--foreground-secondary)"
              fontSize={12}
              allowDecimals={false}
              domain={[0, 2]}
            />
            <Tooltip
              contentStyle={{
                background: "var(--background-elevated)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="am" stackId="a" fill="var(--gold)" name="AM" radius={[0, 0, 0, 0]} />
            <Bar dataKey="pm" stackId="a" fill="var(--accent)" name="PM" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
