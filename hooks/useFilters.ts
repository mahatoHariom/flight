import { useState, useMemo, useEffect } from 'react';
import type { FlightOffer, FlightFilters, PriceDataPoint } from '@/types';
import { applyFilters, getPriceRange, sortFlights, type SortOption, } from '@/lib/utils/filters';
import { format } from 'date-fns';

export const useFilters = (allFlights: FlightOffer[] = [], resetKey?: string) => {
    const [filters, setFilters] = useState<FlightFilters>({
        stops: [],
        priceRange: { min: 0, max: 10000 },
        airlines: [],
    });

    const [sortBy, setSortBy] = useState<SortOption>('price-asc');

    const initialPriceRange = useMemo(() => {
        return getPriceRange(allFlights);
    }, [allFlights]);

    useEffect(() => {
        if (allFlights.length > 0 && filters.priceRange.max === 10000) {
            setFilters((prev) => ({
                ...prev,
                priceRange: initialPriceRange,
            }));
        }
    }, [allFlights, initialPriceRange, filters.priceRange.max]);

    useEffect(() => {
        if (resetKey) {
            setFilters({
                stops: [],
                priceRange: { min: 0, max: 10000 },
                airlines: [],
            });
        }
    }, [resetKey]);

    const filteredFlights = useMemo(() => {
        const filtered = applyFilters(allFlights, filters);
        return sortFlights(filtered, sortBy);
    }, [allFlights, filters, sortBy]);

    const priceGraphData = useMemo((): PriceDataPoint[] => {
        if (filteredFlights.length === 0) return [];

        const dateMap = new Map<string, { total: number; count: number }>();

        filteredFlights.forEach((flight) => {
            const departureDate = flight.itineraries[0].segments[0].departure.at;
            const date = format(new Date(departureDate), 'MMM d');
            const price = parseFloat(flight.price.total);

            if (dateMap.has(date)) {
                const existing = dateMap.get(date)!;
                dateMap.set(date, {
                    total: existing.total + price,
                    count: existing.count + 1,
                });
            } else {
                dateMap.set(date, { total: price, count: 1 });
            }
        });

        return Array.from(dateMap.entries())
            .map(([date, { total, count }]) => ({
                date,
                price: Math.round(total / count),
                count,
            }))
            .sort((a, b) => {
                const dateA = new Date(a.date + ', 2024');
                const dateB = new Date(b.date + ', 2024');
                return dateA.getTime() - dateB.getTime();
            });
    }, [filteredFlights]);

    const updateFilter = <K extends keyof FlightFilters>(
        key: K,
        value: FlightFilters[K]
    ) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const toggleStopFilter = (stop: number) => {
        setFilters((prev) => ({
            ...prev,
            stops: prev.stops.includes(stop)
                ? prev.stops.filter((s) => s !== stop)
                : [...prev.stops, stop],
        }));
    };

    const toggleAirlineFilter = (airline: string) => {
        setFilters((prev) => ({
            ...prev,
            airlines: prev.airlines.includes(airline)
                ? prev.airlines.filter((a) => a !== airline)
                : [...prev.airlines, airline],
        }));
    };

    const clearFilters = () => {
        setFilters({
            stops: [],
            priceRange: initialPriceRange,
            airlines: [],
        });
    };

    const hasActiveFilters = useMemo(() => {
        return (
            filters.stops.length > 0 ||
            filters.airlines.length > 0 ||
            filters.priceRange.min !== initialPriceRange.min ||
            filters.priceRange.max !== initialPriceRange.max
        );
    }, [filters, initialPriceRange]);

    return {
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
    };
};
