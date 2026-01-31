import { useQuery } from '@tanstack/react-query';
import { amadeusAPI } from '@/lib/api/amadeus';
import type { FlightSearchParams } from '@/types';

export const useFlightSearch = (params: FlightSearchParams | null, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['flights', params],
        queryFn: async () => {
            if (!params) {
                throw new Error('Search parameters are required');
            }
            const response = await amadeusAPI.searchFlights(params);
            return response;
        },
        enabled: enabled && params !== null,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
};
