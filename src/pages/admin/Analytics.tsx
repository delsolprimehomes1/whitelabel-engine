import { useState } from 'react';
import { format } from 'date-fns';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Skeleton } from '@/components/ui/skeleton';
import { useAnalytics } from '@/hooks/useAnalytics';
import { DollarSign, ShoppingCart, TrendingUp, TrendingDown, Building2, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

const revenueChartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'hsl(var(--primary))',
  },
};

const ordersChartConfig = {
  orders: {
    label: 'Orders',
    color: 'hsl(var(--accent))',
  },
};

const companiesChartConfig = {
  total_revenue: {
    label: 'Revenue',
    color: 'hsl(var(--primary))',
  },
};

interface GrowthIndicatorProps {
  value: number;
  showIcon?: boolean;
}

function GrowthIndicator({ value, showIcon = true }: GrowthIndicatorProps) {
  const isPositive = value > 0;
  const isNegative = value < 0;
  const isNeutral = value === 0;

  return (
    <div
      className={cn(
        'flex items-center gap-1 text-xs font-medium',
        isPositive && 'text-green-500',
        isNegative && 'text-red-500',
        isNeutral && 'text-muted-foreground'
      )}
    >
      {showIcon && (
        <>
          {isPositive && <ArrowUp className="h-3 w-3" />}
          {isNegative && <ArrowDown className="h-3 w-3" />}
          {isNeutral && <Minus className="h-3 w-3" />}
        </>
      )}
      <span>
        {isPositive && '+'}
        {value.toFixed(1)}%
      </span>
    </div>
  );
}

export default function Analytics() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  
  const { data: analytics, isLoading } = useAnalytics({
    from: dateRange?.from,
    to: dateRange?.to,
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatAxisDate = (dateStr: string) => {
    return format(new Date(dateStr), 'MMM d');
  };

  return (
    <AdminLayout title="Analytics" description="Revenue trends, order volume, and top-performing companies">
      <div className="space-y-6">
        {/* Date Range Filter */}
        <div className="flex justify-end">
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
        </div>

        {/* Summary Cards with Comparison */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {formatCurrency(analytics?.totals.totalRevenue || 0)}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <GrowthIndicator value={analytics?.comparison.revenue.changePercent || 0} />
                    <span className="text-xs text-muted-foreground">vs previous period</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {analytics?.totals.totalOrders || 0}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <GrowthIndicator value={analytics?.comparison.orders.changePercent || 0} />
                    <span className="text-xs text-muted-foreground">vs previous period</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
              {(analytics?.comparison.avgOrderValue.changePercent || 0) >= 0 ? (
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              )}
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {formatCurrency(analytics?.totals.avgOrderValue || 0)}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <GrowthIndicator value={analytics?.comparison.avgOrderValue.changePercent || 0} />
                    <span className="text-xs text-muted-foreground">vs previous period</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Period Comparison Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Period Comparison</CardTitle>
            <CardDescription>Current period vs previous period of the same length</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-24 w-full" />
            ) : (
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Revenue Change</p>
                  <div className="flex items-baseline gap-2">
                    <span className={cn(
                      "text-xl font-bold",
                      (analytics?.comparison.revenue.change || 0) >= 0 ? "text-green-500" : "text-red-500"
                    )}>
                      {(analytics?.comparison.revenue.change || 0) >= 0 ? '+' : ''}
                      {formatCurrency(analytics?.comparison.revenue.change || 0)}
                    </span>
                    <GrowthIndicator value={analytics?.comparison.revenue.changePercent || 0} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Previous: {formatCurrency(analytics?.comparison.revenue.previous || 0)}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Orders Change</p>
                  <div className="flex items-baseline gap-2">
                    <span className={cn(
                      "text-xl font-bold",
                      (analytics?.comparison.orders.change || 0) >= 0 ? "text-green-500" : "text-red-500"
                    )}>
                      {(analytics?.comparison.orders.change || 0) >= 0 ? '+' : ''}
                      {analytics?.comparison.orders.change || 0}
                    </span>
                    <GrowthIndicator value={analytics?.comparison.orders.changePercent || 0} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Previous: {analytics?.comparison.orders.previous || 0} orders
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">AOV Change</p>
                  <div className="flex items-baseline gap-2">
                    <span className={cn(
                      "text-xl font-bold",
                      (analytics?.comparison.avgOrderValue.change || 0) >= 0 ? "text-green-500" : "text-red-500"
                    )}>
                      {(analytics?.comparison.avgOrderValue.change || 0) >= 0 ? '+' : ''}
                      {formatCurrency(analytics?.comparison.avgOrderValue.change || 0)}
                    </span>
                    <GrowthIndicator value={analytics?.comparison.avgOrderValue.changePercent || 0} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Previous: {formatCurrency(analytics?.comparison.avgOrderValue.previous || 0)}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Revenue Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Daily revenue over the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ChartContainer config={revenueChartConfig} className="h-[300px] w-full">
                <AreaChart
                  data={analytics?.dailyStats || []}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatAxisDate}
                    className="text-xs fill-muted-foreground"
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    tickFormatter={(v) => `$${v}`}
                    className="text-xs fill-muted-foreground"
                    tick={{ fontSize: 11 }}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) => formatCurrency(value as number)}
                        labelFormatter={(label) => format(new Date(label), 'MMM d, yyyy')}
                      />
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    fill="url(#revenueGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Order Volume Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Order Volume</CardTitle>
            <CardDescription>Daily order count over the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ChartContainer config={ordersChartConfig} className="h-[300px] w-full">
                <BarChart
                  data={analytics?.dailyStats || []}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatAxisDate}
                    className="text-xs fill-muted-foreground"
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    className="text-xs fill-muted-foreground"
                    tick={{ fontSize: 11 }}
                    allowDecimals={false}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        labelFormatter={(label) => format(new Date(label), 'MMM d, yyyy')}
                      />
                    }
                  />
                  <Bar
                    dataKey="orders"
                    fill="hsl(var(--accent))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Top Companies Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle>Top Performing Companies</CardTitle>
                <CardDescription>Companies by revenue in selected period</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : analytics?.topCompanies && analytics.topCompanies.length > 0 ? (
              <ChartContainer config={companiesChartConfig} className="h-[300px] w-full">
                <BarChart
                  data={analytics.topCompanies}
                  layout="vertical"
                  margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                  <XAxis
                    type="number"
                    tickFormatter={(v) => `$${v}`}
                    className="text-xs fill-muted-foreground"
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="company_name"
                    className="text-xs fill-muted-foreground"
                    tick={{ fontSize: 11 }}
                    width={100}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) => formatCurrency(value as number)}
                      />
                    }
                  />
                  <Bar
                    dataKey="total_revenue"
                    fill="hsl(var(--primary))"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                No order data available for the selected period
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
