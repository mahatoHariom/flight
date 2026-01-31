"use client";

import { SlidersHorizontal, X } from "lucide-react";
import type { FlightFilters, FlightOffer } from "@/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StopsFilter, PriceFilter, AirlineFilter } from "./Filters";
import { cn } from "@/lib/utils";

interface FilterSidebarProps {
    filters: FlightFilters;
    flights: FlightOffer[];
    initialPriceRange: { min: number; max: number };
    hasActiveFilters: boolean;
    onToggleStop: (stop: number) => void;
    onPriceChange: (range: { min: number; max: number }) => void;
    onToggleAirline: (airline: string) => void;
    onClearFilters: () => void;
    dictionary?: {
        carriers?: Record<string, string>;
    };
    className?: string;
}

export function FilterSidebar({
    filters,
    flights,
    initialPriceRange,
    hasActiveFilters,
    onToggleStop,
    onPriceChange,
    onToggleAirline,
    onClearFilters,
    dictionary,
    className
}: FilterSidebarProps) {
    return (
        <div className={cn("bg-card rounded-xl border p-6 h-fit sticky top-4", className)}>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 font-semibold">
                    <SlidersHorizontal className="h-5 w-5" />
                    Filters
                </div>
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClearFilters}
                        className="h-8 px-2 text-muted-foreground hover:text-destructive"
                    >
                        <X className="h-4 w-4 mr-1" /> Clear
                    </Button>
                )}
            </div>

            <div className="space-y-8">
                <StopsFilter
                    selectedStops={filters.stops}
                    onToggle={onToggleStop}
                    flights={flights}
                />

                <Separator />

                <PriceFilter
                    priceRange={filters.priceRange}
                    initialRange={initialPriceRange}
                    onChange={onPriceChange}
                />

                <Separator />

                <AirlineFilter
                    selectedAirlines={filters.airlines}
                    onToggle={onToggleAirline}
                    flights={flights}
                    dictionary={dictionary}
                />
            </div>
        </div>
    );
}
