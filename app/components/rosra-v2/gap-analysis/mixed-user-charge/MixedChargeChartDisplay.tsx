import React from 'react';
import { MixedChargeData, MixedChargeMetrics } from '@/app/types/mixed-charge-analysis';
import { useCurrency } from '@/app/context/CurrencyContext';
import { MixedChargeAnalysisService } from '@/app/services/mixed-charge-analysis.service';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Card, CardContent } from '@/app/components/ui/card';

// Import chart components
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface MixedChargeChartDisplayProps {
  data: MixedChargeData;
  metrics: MixedChargeMetrics;
}

export const MixedChargeChartDisplay: React.FC<MixedChargeChartDisplayProps> = ({ data, metrics }) => {
  const { selectedCountry } = useCurrency();
  const currencySymbol = selectedCountry?.currency_symbol || '$';
  
  const formatCurrency = (amount: number) => {
    return MixedChargeAnalysisService.formatCurrency(amount, currencySymbol);
  };

  // Calculate revenue data
  const actualDailyRevenue = data.actualDailyUsers * data.actualDailyUserFee * 365;
  const potentialDailyRevenue = data.estimatedDailyUsers * data.averageDailyUserFee * 365;
  const actualMonthlyRevenue = data.payingMonthlyUsers * data.actualMonthlyRate * 12;
  const potentialMonthlyRevenue = data.availableMonthlyUsers * data.averageMonthlyRate * 12;

  // Prepare data for revenue chart
  const revenueChartData = [
    {
      name: 'Daily Revenue',
      Actual: actualDailyRevenue,
      Potential: potentialDailyRevenue,
      Gap: potentialDailyRevenue - actualDailyRevenue
    },
    {
      name: 'Monthly Revenue',
      Actual: actualMonthlyRevenue,
      Potential: potentialMonthlyRevenue,
      Gap: potentialMonthlyRevenue - actualMonthlyRevenue
    },
    {
      name: 'Total Revenue',
      Actual: metrics.actual,
      Potential: metrics.potential,
      Gap: metrics.gap
    }
  ];

  // Prepare data for gap breakdown chart
  const gapBreakdownData = [
    { name: 'Compliance Gap', value: metrics.gapBreakdown.complianceGap },
    { name: 'Rate Gap', value: metrics.gapBreakdown.rateGap },
    { name: 'Combined Gaps', value: metrics.gapBreakdown.combinedGaps }
  ].filter(item => item.value > 0);

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Custom tooltip for revenue chart
  const RevenueTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for gap breakdown chart
  const GapTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p>{formatCurrency(data.value)}</p>
          <p>
            {metrics.gap > 0 ? ((data.value / metrics.gap) * 100).toFixed(1) : 0}% of total gap
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Charts</h3>
      
      <Tabs defaultValue="revenue">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
          <TabsTrigger value="gap">Gap Breakdown</TabsTrigger>
        </TabsList>
        
        <TabsContent value="revenue">
          <Card>
            <CardContent className="pt-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={revenueChartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis 
                      tickFormatter={(value) => 
                        value >= 1000000
                          ? `${(value / 1000000).toFixed(1)}M`
                          : value >= 1000
                          ? `${(value / 1000).toFixed(1)}K`
                          : value.toString()
                      } 
                    />
                    <Tooltip content={<RevenueTooltip />} />
                    <Legend />
                    <Bar dataKey="Actual" fill="#0088FE" />
                    <Bar dataKey="Potential" fill="#00C49F" />
                    <Bar dataKey="Gap" fill="#FF8042" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="gap">
          <Card>
            <CardContent className="pt-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={gapBreakdownData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    >
                      {gapBreakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<GapTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
