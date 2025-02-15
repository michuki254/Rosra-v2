import { 
  BarChart, 
  Bar,
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList 
} from 'recharts';

interface GapBreakdownChartProps {
  registrationGap: number;
  complianceGap: number;
  assessmentGap: number;
  rateGap: number;
  combinedGap: number;
}

export default function GapBreakdownChart({ 
  registrationGap,
  complianceGap,
  assessmentGap,
  rateGap,
  combinedGap 
}: GapBreakdownChartProps) {
  const data = [
    {
      name: "Gap Analysis",
      "Total Registration Gap": registrationGap,
      "Total Compliance Gap": complianceGap,
      "Total Assessment Gap": assessmentGap,
      "Total Rate Gap": rateGap,
      "Combined Gap": combinedGap
    }
  ];

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 30,
            bottom: 20,
          }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="currentColor" 
            opacity={0.1}
          />
          <XAxis 
            dataKey="name"
            stroke="currentColor"
            tick={{ fill: 'currentColor' }}
            tickLine={{ stroke: 'currentColor' }}
          />
          <YAxis 
            tickFormatter={(value) => value.toLocaleString()}
            stroke="currentColor"
            tick={{ fill: 'currentColor' }}
            tickLine={{ stroke: 'currentColor' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '0.5rem',
              color: '#f3f4f6'
            }}
            labelStyle={{ color: '#f3f4f6' }}
            itemStyle={{ color: '#f3f4f6' }}
            formatter={(value) => value.toLocaleString()}
          />
          <Legend 
            wrapperStyle={{
              color: 'currentColor'
            }}
          />
          <Bar 
            dataKey="Total Registration Gap" 
            stackId="a"
            fill="#3b82f6" // blue-500
            name="Total Registration Gap"
          >
            <LabelList 
              dataKey="Total Registration Gap" 
              position="center"
              fill="#ffffff"
              formatter={(value) => value.toLocaleString()}
            />
          </Bar>
          <Bar 
            dataKey="Total Compliance Gap" 
            stackId="a"
            fill="#f97316" // orange-500
            name="Total Compliance Gap"
          >
            <LabelList 
              dataKey="Total Compliance Gap" 
              position="center"
              fill="#ffffff"
              formatter={(value) => value.toLocaleString()}
            />
          </Bar>
          <Bar 
            dataKey="Total Assessment Gap" 
            stackId="a"
            fill="#94a3b8" // slate-400
            name="Total Assessment Gap"
          >
            <LabelList 
              dataKey="Total Assessment Gap" 
              position="center"
              fill="#ffffff"
              formatter={(value) => value.toLocaleString()}
            />
          </Bar>
          <Bar 
            dataKey="Total Rate Gap" 
            stackId="a"
            fill="#fbbf24" // amber-400
            name="Total Rate Gap"
          >
            <LabelList 
              dataKey="Total Rate Gap" 
              position="center"
              fill="#ffffff"
              formatter={(value) => value.toLocaleString()}
            />
          </Bar>
          <Bar 
            dataKey="Combined Gap" 
            stackId="a"
            fill="#60a5fa" // blue-400
            name="Combined Gap"
          >
            <LabelList 
              dataKey="Combined Gap" 
              position="center"
              fill="#ffffff"
              formatter={(value) => value.toLocaleString()}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 