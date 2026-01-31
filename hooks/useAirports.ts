import { useQuery } from '@tanstack/react-query';
import { amadeusAPI } from '@/lib/api/amadeus';
import { useState, useEffect } from 'react';

/**
 * Hook to search for airports with debouncing
 */
export const useAirportSearch = (keyword: string, debounceMs: number = 300) => {
    const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedKeyword(keyword);
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [keyword, debounceMs]);

    return useQuery({
        queryKey: ['airports', debouncedKeyword],
        queryFn: async () => {
            if (!debouncedKeyword || debouncedKeyword.length < 2) {
                return { meta: { count: 0, links: { self: '' } }, data: [] };
            }
            const response = await amadeusAPI.searchAirports(debouncedKeyword);
            return response;
        },
        enabled: debouncedKeyword.length >= 2,
        staleTime: 10 * 60 * 1000, // 10 minutes
        gcTime: 30 * 60 * 1000, // 30 minutes
    });
};
