"use client";

import { useState } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { PriceDataPoint } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChartIcon, BarChart3, Activity, TrendingDown, TrendingUp } from "lucide-react";

interface PriceGraphProps {
    data: PriceDataPoint[];
    currency?: string;
}

type ChartType = 'line' | 'area' | 'bar';

export const PriceGraph = ({ data, currency = 'USD' }: PriceGraphProps) => {
    const [chartType, setChartType] = useState<ChartType>('area');

    if (data.length === 0) {
        return (
            <Card className="h-[300px] flex items-center justify-center text-muted-foreground">
                <p>No price data available</p>
            </Card>
        );
    }

    const formatPrice = (price: number | undefined) => {
        if (typeof price !== 'number') return '';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const prices = data.map((d) => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
    const lowestPricePoint = data.find((d) => d.price === minPrice);
    const highestPricePoint = data.find((d) => d.price === maxPrice);

    const renderChart = () => {
        const commonProps = {
            data,
            margin: { top: 10, right: 30, left: 10, bottom: 5 }
        };

        const tooltipProps = {
            contentStyle: {
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
                color: 'hsl(var(--popover-foreground))',
            },
            formatter: (value: number | undefined) => [formatPrice(value), 'Price'],
            labelFormatter: (label: any) => `Date: ${label}`,
        };

        switch (chartType) {
            case 'line':
                return (
                    <LineChart {...commonProps}>
                        <defs>
                            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="hsl(250 70% 60%)" />
                                <stop offset="100%" stopColor="hsl(270 65% 65%)" />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                        <XAxis
                            dataKey="date"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: '#888888' }}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value: number) => formatPrice(value)}
                            tick={{ fill: '#888888' }}
                        />
                        <Tooltip {...tooltipProps} />
                        <Line
                            type="monotone"
                            dataKey="price"
                            stroke="url(#lineGradient)"
                            strokeWidth={3}
                            dot={{
                                fill: 'hsl(250 70% 60%)',
                                strokeWidth: 2,
                                r: 5,
                                stroke: 'hsl(var(--background))',
                            }}
                            activeDot={{
                                r: 7,
                                fill: 'hsl(270 65% 65%)',
                                stroke: 'hsl(var(--background))',
                                strokeWidth: 3,
                            }}
                        />
                    </LineChart>
                );

            case 'area':
                return (
                    <AreaChart {...commonProps}>
                        <defs>
                            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(250 70% 60%)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="hsl(270 65% 65%)" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                        <XAxis
                            dataKey="date"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: '#888888' }}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value: number) => formatPrice(value)}
                            tick={{ fill: '#888888' }}
                        />
                        <Tooltip {...tooltipProps} />
                        <Area
                            type="monotone"
                            dataKey="price"
                            stroke="hsl(250 70% 60%)"
                            strokeWidth={3}
                            fill="url(#areaGradient)"
                            dot={{
                                fill: 'hsl(250 70% 60%)',
                                strokeWidth: 2,
                                r: 4,
                                stroke: 'hsl(var(--background))',
                            }}
                            activeDot={{
                                r: 6,
                                fill: 'hsl(270 65% 65%)',
                                stroke: 'hsl(var(--background))',
                                strokeWidth: 2,
                            }}
                        />
                    </AreaChart>
                );

            case 'bar':
                return (
                    <BarChart {...commonProps}>
                        <defs>
                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="hsl(250 70% 60%)" />
                                <stop offset="100%" stopColor="hsl(270 65% 65%)" />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                        <XAxis
                            dataKey="date"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: '#888888' }}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value: number) => formatPrice(value)}
                            tick={{ fill: '#888888' }}
                        />
                        <Tooltip {...tooltipProps} />
                        <Bar
                            dataKey="price"
                            fill="url(#barGradient)"
                            radius={[8, 8, 0, 0]}
                        />
                    </BarChart>
                );
        }
    };

    return (
        <Card className="shadow-lg border-border overflow-hidden">
            <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <CardTitle className="text-xl md:text-2xl font-bold flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" />
                        Price Trends
                    </CardTitle>

                    <div className="flex items-center gap-2">
                        <Button
                            variant={chartType === 'line' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setChartType('line')}
                            className="gap-1.5"
                        >
                            <LineChartIcon className="h-4 w-4" />
                            <span className="hidden sm:inline">Line</span>
                        </Button>
                        <Button
                            variant={chartType === 'area' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setChartType('area')}
                            className="gap-1.5"
                        >
                            <Activity className="h-4 w-4" />
                            <span className="hidden sm:inline">Area</span>
                        </Button>
                        <Button
                            variant={chartType === 'bar' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setChartType('bar')}
                            className="gap-1.5"
                        >
                            <BarChart3 className="h-4 w-4" />
                            <span className="hidden sm:inline">Bar</span>
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        {renderChart()}
                    </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                    <div className="flex flex-col items-center p-3 rounded-lg bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30">
                        <div className="flex items-center gap-1.5 mb-1">
                            <TrendingDown className="h-4 w-4 text-green-600 dark:text-green-400" />
                            <span className="text-xs text-green-700 dark:text-green-300 font-medium uppercase tracking-wider">
                                Lowest
                            </span>
                        </div>
                        <span className="text-lg md:text-xl font-bold text-green-700 dark:text-green-200">
                            {formatPrice(minPrice)}
                        </span>
                        {lowestPricePoint && (
                            <span className="text-xs text-green-600 dark:text-green-400 mt-0.5">
                                {lowestPricePoint.date}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col items-center p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30">
                        <div className="flex items-center gap-1.5 mb-1">
                            <TrendingUp className="h-4 w-4 text-red-600 dark:text-red-400" />
                            <span className="text-xs text-red-700 dark:text-red-300 font-medium uppercase tracking-wider">
                                Highest
                            </span>
                        </div>
                        <span className="text-lg md:text-xl font-bold text-red-700 dark:text-red-200">
                            {formatPrice(maxPrice)}
                        </span>
                        {highestPricePoint && (
                            <span className="text-xs text-red-600 dark:text-red-400 mt-0.5">
                                {highestPricePoint.date}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col items-center p-3 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30">
                        <span className="text-xs text-blue-700 dark:text-blue-300 font-medium uppercase tracking-wider mb-1">
                            Average
                        </span>
                        <span className="text-lg md:text-xl font-bold text-blue-700 dark:text-blue-200">
                            {formatPrice(avgPrice)}
                        </span>
                        <span className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                            {data.length} days
                        </span>
                    </div>

                    <div className="flex flex-col items-center p-3 rounded-lg bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30">
                        <span className="text-xs text-purple-700 dark:text-purple-300 font-medium uppercase tracking-wider mb-1">
                            Flights
                        </span>
                        <span className="text-lg md:text-xl font-bold text-purple-700 dark:text-purple-200">
                            {data.reduce((sum, d) => sum + d.count, 0)}
                        </span>
                        <span className="text-xs text-purple-600 dark:text-purple-400 mt-0.5">
                            Analyzed
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
