"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Plane, ArrowLeft, SlidersHorizontal } from "lucide-react";
import { FilterSidebar } from "@/components/filters/FilterSidebar";
import { FlightList } from "@/components/results/FlightList";
import { PriceGraph } from "@/components/charts/PriceGraph";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { ErrorState } from "@/components/common/ErrorState";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { useFlightSearch } from "@/hooks/useFlightSearch";
import { useFilters } from "@/hooks/useFilters";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import type { FlightSearchParams } from "@/types";

export default function ResultsPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const flightParams: FlightSearchParams | null = searchParams.get("origin")
        ? {
            originLocationCode: searchParams.get("origin")!,
            destinationLocationCode: searchParams.get("destination")!,
            departureDate: searchParams.get("departureDate")!,
            returnDate: searchParams.get("returnDate") || undefined,
            adults: parseInt(searchParams.get("adults") || "1"),
            children: searchParams.get("children") ? parseInt(searchParams.get("children")!) : undefined,
            infants: searchParams.get("infants") ? parseInt(searchParams.get("infants")!) : undefined,
            travelClass: (searchParams.get("travelClass") as FlightSearchParams["travelClass"]) || "ECONOMY",
            currencyCode: "USD",
            max: 50,
        }
        : null;

    const { data, isLoading, isError, refetch } = useFlightSearch(flightParams);

    const {
        filters,
        filteredFlights,
        priceGraphData,
        initialPriceRange,
        sortBy,
        hasActiveFilters,
        updateFilter,
        toggleStopFilter,
        toggleAirlineFilter,
        setSortBy,
        clearFilters,
    } = useFilters(data?.data || [], flightParams ? JSON.stringify(flightParams) : undefined);

    return (
        <div className="min-h-screen flex flex-col">
            <header className="glass-card sticky top-0 z-30 border-b backdrop-blur-lg">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 md:gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push("/")}
                            className="gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span className="hidden sm:inline">Back</span>
                        </Button>
                        <div className="flex items-center gap-2 md:gap-3">
                            <div className="bg-primary text-primary-foreground p-2 rounded-lg shadow-lg">
                                <Plane className="h-5 w-5 md:h-6 md:w-6" />
                            </div>
                            <h1 className="text-lg md:text-xl font-bold tracking-tight gradient-text">SkySearch</h1>
                        </div>
                    </div>
                    <ThemeToggle />
                </div>
            </header>

            <main className="flex-1 container mx-auto px-4 py-6 md:py-8">
                {!flightParams ? (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground">No search parameters found. Please go back and search for flights.</p>
                        <Button onClick={() => router.push("/")} className="mt-4">
                            Go to Home
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 md:gap-8 items-start">
                        <aside className="hidden lg:block">
                            <FilterSidebar
                                filters={filters}
                                flights={data?.data || []}
                                initialPriceRange={initialPriceRange}
                                hasActiveFilters={hasActiveFilters}
                                onToggleStop={toggleStopFilter}
                                onPriceChange={(range) => updateFilter("priceRange", range)}
                                onToggleAirline={toggleAirlineFilter}
                                onClearFilters={clearFilters}
                                dictionary={data?.dictionaries}
                            />
                        </aside>

                        <div className="space-y-4 md:space-y-6">
                            <div className="lg:hidden">
                                <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                                    <SheetTrigger asChild>
                                        <Button variant="outline" className="w-full gap-2">
                                            <SlidersHorizontal className="h-4 w-4" />
                                            Filters {hasActiveFilters && `(${filters.stops.length + filters.airlines.length})`}
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
                                        <SheetHeader>
                                            <SheetTitle>Filters</SheetTitle>
                                        </SheetHeader>
                                        <div className="mt-6">
                                            <FilterSidebar
                                                filters={filters}
                                                flights={data?.data || []}
                                                initialPriceRange={initialPriceRange}
                                                hasActiveFilters={hasActiveFilters}
                                                onToggleStop={toggleStopFilter}
                                                onPriceChange={(range) => updateFilter("priceRange", range)}
                                                onToggleAirline={toggleAirlineFilter}
                                                onClearFilters={clearFilters}
                                                dictionary={data?.dictionaries}
                                                className="border-0 p-0"
                                            />
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>

                            {isLoading ? (
                                <LoadingSkeleton count={3} />
                            ) : isError ? (
                                <ErrorState onRetry={() => refetch()} />
                            ) : (
                                <>
                                    {filteredFlights.length > 0 && (
                                        <PriceGraph
                                            data={priceGraphData}
                                            currency={data?.data[0]?.price.currency}
                                        />
                                    )}

                                    <FlightList
                                        flights={filteredFlights}
                                        dictionary={data?.dictionaries}
                                        sortBy={sortBy}
                                        onSortChange={setSortBy}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                )}
            </main>

            <footer className="border-t py-8 md:py-12 glass-card backdrop-blur-lg">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                                <Plane className="h-5 w-5" />
                            </div>
                            <span className="font-bold gradient-text">SkySearch</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            © {new Date().getFullYear()} SkySearch. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
