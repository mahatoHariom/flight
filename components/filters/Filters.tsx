"use client";

import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency } from "@/lib/utils/formatters";
import type { FlightOffer } from "@/types";
import { STOPS_OPTIONS } from "@/lib/utils/constants";
import { calculateTotalStops } from "@/lib/utils/formatters";

export function StopsFilter({
    selectedStops,
    onToggle,
    flights,
}: {
    selectedStops: number[];
    onToggle: (stop: number) => void;
    flights: FlightOffer[];
}) {
    const getFlightCount = (stopValue: number) => {
        return flights.filter((flight) => {
            const totalStops = calculateTotalStops(flight.itineraries[0].segments);
            if (stopValue === 2) return totalStops >= 2;
            return totalStops === stopValue;
        }).length;
    };

    return (
        <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Stops</h3>
            <div className="space-y-3">
                {STOPS_OPTIONS.map((option) => {
                    const count = getFlightCount(option.value);
                    const disabled = count === 0;
                    return (
                        <div key={option.value} className="flex items-center space-x-2">
                            <Checkbox
                                id={`stop-${option.value}`}
                                checked={selectedStops.includes(option.value)}
                                onCheckedChange={() => onToggle(option.value)}
                                disabled={disabled}
                            />
                            <Label
                                htmlFor={`stop-${option.value}`}
                                className={`flex-1 flex justify-between cursor-pointer ${disabled ? 'opacity-50' : ''}`}
                            >
                                <span>{option.label}</span>
                                <span className="text-muted-foreground text-xs">({count})</span>
                            </Label>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export function PriceFilter({
    priceRange,
    initialRange,
    onChange,
}: {
    priceRange: { min: number; max: number };
    initialRange: { min: number; max: number };
    onChange: (range: { min: number; max: number }) => void;
}) {
    const safeMin = initialRange.min || 0;
    const safeMax = initialRange.max || 1000;

    if (safeMin === safeMax) return null;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Price Range</h3>
                <span className="text-xs font-mono bg-secondary px-2 py-0.5 rounded">
                    {formatCurrency(priceRange.min)} - {formatCurrency(priceRange.max)}
                </span>
            </div>

            <Slider
                min={safeMin}
                max={safeMax}
                step={10}
                value={[priceRange.min, priceRange.max]}
                onValueChange={(value) => onChange({ min: value[0], max: value[1] })}
                className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatCurrency(safeMin)}</span>
                <span>{formatCurrency(safeMax)}</span>
            </div>
        </div>
    );
}

export function AirlineFilter({
    selectedAirlines,
    onToggle,
    flights,
    dictionary,
}: {
    selectedAirlines: string[];
    onToggle: (airline: string) => void;
    flights: FlightOffer[];
    dictionary?: { carriers?: Record<string, string> };
}) {
    const airlines = flights.reduce((acc, flight) => {
        const code = flight.validatingAirlineCodes[0];
        const name = dictionary?.carriers?.[code] || code;
        const price = parseFloat(flight.price.total);

        if (!acc[code]) {
            acc[code] = { code, name, count: 0, minPrice: price };
        }
        acc[code].count++;
        acc[code].minPrice = Math.min(acc[code].minPrice, price);

        return acc;
    }, {} as Record<string, { code: string; name: string; count: number; minPrice: number }>);

    const sortedAirlines = Object.values(airlines).sort((a, b) => b.count - a.count);

    if (sortedAirlines.length === 0) return null;

    return (
        <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Airlines</h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {sortedAirlines.map((airline) => (
                    <div key={airline.code} className="flex items-center justify-between space-x-2">
                        <div className="flex items-center space-x-2 flex-1">
                            <Checkbox
                                id={`airline-${airline.code}`}
                                checked={selectedAirlines.includes(airline.code)}
                                onCheckedChange={() => onToggle(airline.code)}
                            />
                            <Label htmlFor={`airline-${airline.code}`} className="cursor-pointer truncate max-w-[140px]" title={airline.name}>
                                {airline.name}
                            </Label>
                        </div>
                        <div className="text-right">
                            <div className="text-xs font-medium">{formatCurrency(airline.minPrice)}</div>
                            <div className="text-[10px] text-muted-foreground">{airline.count} flights</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
