import { format, parseISO } from 'date-fns';

/**
 * Format currency amount
 */
export const formatCurrency = (amount: string | number, currency: string = 'USD'): string => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(numAmount);
};

/**
 * Format flight duration from ISO 8601 duration string
 * Example: PT2H30M -> "2h 30m"
 */
export const formatDuration = (duration: string): string => {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (!match) return duration;

    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;

    if (hours === 0) return `${minutes}m`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
};

/**
 * Format date and time
 */
export const formatDateTime = (dateString: string): string => {
    try {
        const date = parseISO(dateString);
        return format(date, 'MMM d, h:mm a');
    } catch {
        return dateString;
    }
};

/**
 * Format time only
 */
export const formatTime = (dateString: string): string => {
    try {
        const date = parseISO(dateString);
        return format(date, 'h:mm a');
    } catch {
        return dateString;
    }
};

/**
 * Format date only
 */
export const formatDate = (dateString: string | Date): string => {
    try {
        const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
        return format(date, 'MMM d, yyyy');
    } catch {
        return String(dateString);
    }
};

/**
 * Format date for API (YYYY-MM-DD)
 */
export const formatDateForAPI = (date: Date): string => {
    return format(date, 'yyyy-MM-dd');
};

/**
 * Format airport display
 */
export const formatAirport = (code: string, name?: string, city?: string): string => {
    if (!name && !city) return code;
    if (!city) return `${code} - ${name}`;
    return `${code} - ${city}`;
};

/**
 * Get number of stops text
 */
export const getStopsText = (numberOfStops: number): string => {
    if (numberOfStops === 0) return 'Non-stop';
    if (numberOfStops === 1) return '1 stop';
    return `${numberOfStops} stops`;
};

/**
 * Calculate total stops in itinerary
 */
export const calculateTotalStops = (segments: { numberOfStops: number }[]): number => {
    // The number of stops is segments.length - 1 (connections between segments)
    // Plus any stops within individual segments
    const segmentStops = segments.reduce((sum, seg) => sum + seg.numberOfStops, 0);
    const connectionStops = Math.max(0, segments.length - 1);
    return segmentStops + connectionStops;
};

/**
 * Get airline name from code
 */
export const getAirlineName = (code: string, dictionary?: Record<string, string>): string => {
    if (dictionary && dictionary[code]) {
        return dictionary[code];
    }
    return code;
};

/**
 * Extract hour from ISO date string
 */
export const extractHour = (dateString: string): number => {
    try {
        const date = parseISO(dateString);
        return date.getHours();
    } catch {
        return 0;
    }
};
