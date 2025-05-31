import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

type Stats = {
    error_name: string;
    total_error_count: number;
    error_rank: number;
};

interface StatsBarChartProps {
    data: Stats[];
}

function CustomTooltip({
        active,
        payload,
        label,
    }: TooltipProps<ValueType, NameType>) {
        if (active && payload && payload.length) {
            return (
                <div className="bg-base-100 text-white rounded-md p-2 shadow-lg">
                    <p className="font-bold mb-1">{label}</p>
                    <p>
                        <span className="font-semibold">Count: </span>
                        {payload[0].value?.toLocaleString()}
                    </p>
                </div>
            );
        }
        return null;
    }

export default function StatsBarChart({ data }: StatsBarChartProps) {
    const sortedData = [...data].sort((a, b) => a.error_rank - b.error_rank);

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sortedData}>
                <XAxis
                    dataKey="error_name"
                    type="category"
                    interval={0}
                    angle={-25}
                    textAnchor="end"
                    height={40}
                    tick={{ fontSize: 12 }} />
                <YAxis type="number" />
                <Tooltip content={CustomTooltip} />
                <defs>
                    <linearGradient id="statpad-gradient" x1="1" y1="1" x2="1" y2="0">
                        <stop offset="0%" stopColor="#F3E3F9" />
                        <stop offset="50%" stopColor="#E1C6F2" />
                        <stop offset="100%" stopColor="#D1A7F2" />
                    </linearGradient>
                </defs>
                <Bar
                    dataKey="total_error_count"
                    fill="url(#statpad-gradient)"
                    barSize={30}
                    radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}