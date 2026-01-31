export const CABIN_CLASSES = [
    { value: 'ECONOMY', label: 'Economy' },
    { value: 'PREMIUM_ECONOMY', label: 'Premium Economy' },
    { value: 'BUSINESS', label: 'Business' },
    { value: 'FIRST', label: 'First Class' },
] as const;

export const STOPS_OPTIONS = [
    { value: 0, label: 'Non-stop' },
    { value: 1, label: '1 Stop' },
    { value: 2, label: '2+ Stops' },
] as const;

export const DEFAULT_SEARCH_PARAMS = {
    adults: 1,
    children: 0,
    infants: 0,
    travelClass: 'ECONOMY' as const,
    currencyCode: 'USD',
    max: 50,
};

export const API_CONFIG = {
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
    REQUEST_TIMEOUT: 30000,
};
