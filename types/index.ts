// ===== FLIGHT SEARCH TYPES =====
export interface FlightSearchParams {
    originLocationCode: string;
    destinationLocationCode: string;
    departureDate: string;
    returnDate?: string;
    adults: number;
    children?: number;
    infants?: number;
    travelClass?: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
    nonStop?: boolean;
    currencyCode?: string;
    max?: number;
}

export interface FlightOffer {
    type: string;
    id: string;
    source: string;
    instantTicketingRequired: boolean;
    nonHomogeneous: boolean;
    oneWay: boolean;
    lastTicketingDate: string;
    numberOfBookableSeats: number;
    itineraries: Itinerary[];
    price: Price;
    pricingOptions: PricingOptions;
    validatingAirlineCodes: string[];
    travelerPricings: TravelerPricing[];
}

export interface Itinerary {
    duration: string;
    segments: Segment[];
}

export interface Segment {
    departure: FlightEndpoint;
    arrival: FlightEndpoint;
    carrierCode: string;
    number: string;
    aircraft: Aircraft;
    operating?: Operating;
    duration: string;
    id: string;
    numberOfStops: number;
    blacklistedInEU: boolean;
}

export interface FlightEndpoint {
    iataCode: string;
    terminal?: string;
    at: string;
}

export interface Aircraft {
    code: string;
}

export interface Operating {
    carrierCode: string;
}

export interface Price {
    currency: string;
    total: string;
    base: string;
    fees: Fee[];
    grandTotal: string;
}

export interface Fee {
    amount: string;
    type: string;
}

export interface PricingOptions {
    fareType: string[];
    includedCheckedBagsOnly: boolean;
}

export interface TravelerPricing {
    travelerId: string;
    fareOption: string;
    travelerType: string;
    price: Price;
    fareDetailsBySegment: FareDetailsBySegment[];
}

export interface FareDetailsBySegment {
    segmentId: string;
    cabin: string;
    fareBasis: string;
    class: string;
    includedCheckedBags: IncludedCheckedBags;
}

export interface IncludedCheckedBags {
    weight?: number;
    weightUnit?: string;
    quantity?: number;
}

// ===== AIRPORT TYPES =====
export interface Airport {
    type: string;
    subType: string;
    name: string;
    detailedName: string;
    id: string;
    self: {
        href: string;
        methods: string[];
    };
    timeZoneOffset: string;
    iataCode: string;
    geoCode: GeoCode;
    address: Address;
    analytics: Analytics;
}

export interface GeoCode {
    latitude: number;
    longitude: number;
}

export interface Address {
    cityName: string;
    cityCode: string;
    countryName: string;
    countryCode: string;
    regionCode: string;
}

export interface Analytics {
    travelers: Travelers;
}

export interface Travelers {
    score: number;
}

// ===== FILTER TYPES =====
export interface FlightFilters {
    stops: number[]; // 0 = non-stop, 1 = 1 stop, 2+ = 2 or more stops
    priceRange: {
        min: number;
        max: number;
    };
    airlines: string[];
    departureTimeRange?: {
        start: number; // 0-23 hours
        end: number;
    };
    arrivalTimeRange?: {
        start: number;
        end: number;
    };
}

// ===== AMADEUS API TYPES =====
export interface AmadeusAuthResponse {
    type: string;
    username: string;
    application_name: string;
    client_id: string;
    token_type: string;
    access_token: string;
    expires_in: number;
    state: string;
    scope: string;
}

export interface AmadeusFlightOffersResponse {
    meta: {
        count: number;
        links?: {
            self: string;
        };
    };
    data: FlightOffer[];
    dictionaries?: {
        locations?: Record<string, LocationDictionary>;
        aircraft?: Record<string, string>;
        currencies?: Record<string, string>;
        carriers?: Record<string, string>;
    };
}

export interface LocationDictionary {
    cityCode: string;
    countryCode: string;
}

export interface AmadeusAirportResponse {
    meta: {
        count: number;
        links: {
            self: string;
        };
    };
    data: Airport[];
}

// ===== PRICE GRAPH TYPES =====
export interface PriceDataPoint {
    date: string;
    price: number;
    count: number;
}

// ===== AIRLINE INFO =====
export interface AirlineInfo {
    code: string;
    name: string;
    logo?: string;
}

// ===== FORM TYPES =====
export interface SearchFormData {
    origin: string;
    destination: string;
    departureDate: Date;
    returnDate?: Date;
    passengers: {
        adults: number;
        children: number;
        infants: number;
    };
    travelClass: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
}
