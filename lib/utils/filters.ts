import type { FlightOffer, FlightFilters } from '@/types';

export type SortOption = 'price-asc' | 'price-desc' | 'duration-asc' | 'duration-desc';

/**
 * Filter flights based on criteria
 */
export const applyFilters = (flights: FlightOffer[], filters: FlightFilters): FlightOffer[] => {
    return flights.filter((flight) => {
        // Stops filter
        if (filters.stops.length > 0) {
            const stops = flight.itineraries[0].segments.length - 1;
            // 0 stops = 1 segment, 1 stop = 2 segments, 2+ stops = 3+ segments
            // If filters.stops includes 2, it means 2 or more stops
            const isMatch = filters.stops.some((s) => {
                if (s >= 2) return stops >= 2;
                return stops === s;
            });
            if (!isMatch) return false;
        }

        // Price filter
        const price = parseFloat(flight.price.total);
        if (price < filters.priceRange.min || price > filters.priceRange.max) {
            return false;
        }

        // Airlines filter
        if (filters.airlines.length > 0) {
            const airline = flight.validatingAirlineCodes[0];
            if (!filters.airlines.includes(airline)) {
                return false;
            }
        }

        return true;
    });
};

/**
 * Get min and max price from flight offers
 */
export const getPriceRange = (flights: FlightOffer[]): { min: number; max: number } => {
    if (flights.length === 0) return { min: 0, max: 1000 };

    const prices = flights.map((f) => parseFloat(f.price.total));
    const min = Math.floor(Math.min(...prices));
    const max = Math.ceil(Math.max(...prices));

    return { min, max };
};

/**
 * Sort flights
 */
export const sortFlights = (flights: FlightOffer[], sortBy: SortOption): FlightOffer[] => {
    return [...flights].sort((a, b) => {
        const priceA = parseFloat(a.price.total);
        const priceB = parseFloat(b.price.total);
        const durationA = parseDuration(a.itineraries[0].duration);
        const durationB = parseDuration(b.itineraries[0].duration);

        switch (sortBy) {
            case 'price-asc':
                return priceA - priceB;
            case 'price-desc':
                return priceB - priceA;
            case 'duration-asc':
                return durationA - durationB;
            case 'duration-desc':
                return durationB - durationA;
            default:
                return 0;
        }
    });
};

/**
 * Parse ISO 8601 duration to minutes
 * PT2H30M -> 150
 */
const parseDuration = (duration: string): number => {
    // Basic parser for PT#H#M format
    let minutes = 0;

    const hoursMatch = duration.match(/(\d+)H/);
    if (hoursMatch) {
        minutes += parseInt(hoursMatch[1]) * 60;
    }

    const minutesMatch = duration.match(/(\d+)M/);
    if (minutesMatch) {
        minutes += parseInt(minutesMatch[1]);
    }

    return minutes;
};
