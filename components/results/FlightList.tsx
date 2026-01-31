"use client";

import { ArrowUpDown } from "lucide-react";
import type { FlightOffer } from "@/types";
import type { SortOption } from "@/lib/utils/filters";
import { FlightCard } from "./FlightCard";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface FlightListProps {
    flights: FlightOffer[];
    dictionary?: {
        carriers?: Record<string, string>;
    };
    sortBy: SortOption;
    onSortChange: (sort: SortOption) => void;
}

export function FlightList({ flights, dictionary, sortBy, onSortChange }: FlightListProps) {
    if (flights.length === 0) {
        return (
            <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
                <div className="text-muted-foreground">No flights found matching your criteria.</div>
                <div className="text-sm text-muted-foreground mt-2">Try adjusting your filters or search parameters.</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-4 rounded-lg border">
                <div className="font-medium">
                    {flights.length} {flights.length === 1 ? 'flight' : 'flights'} found
                </div>

                <div className="flex items-center gap-3">
                    <Label className="text-sm text-muted-foreground hidden sm:block">Sort by:</Label>
                    <Select value={sortBy} onValueChange={(v) => onSortChange(v as SortOption)}>
                        <SelectTrigger className="w-[180px]">
                            <ArrowUpDown className="mr-2 h-4 w-4 opacity-50" />
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="price-asc">Price: Low to High</SelectItem>
                            <SelectItem value="price-desc">Price: High to Low</SelectItem>
                            <SelectItem value="duration-asc">Duration: Shortest</SelectItem>
                            <SelectItem value="duration-desc">Duration: Longest</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-4">
                {flights.map((flight) => (
                    <FlightCard key={flight.id} flight={flight} dictionary={dictionary} />
                ))}
            </div>
        </div>
    );
}
