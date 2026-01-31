import axios, { type AxiosInstance } from 'axios';
import type {
    AmadeusAuthResponse,
    AmadeusFlightOffersResponse,
    AmadeusAirportResponse,
    FlightSearchParams,
} from '@/types';

class AmadeusAPI {
    private client: AxiosInstance;
    private accessToken: string | null = null;
    private tokenExpiry: number | null = null;
    private readonly clientId: string;
    private readonly clientSecret: string;
    private readonly baseURL: string;

    constructor() {
        this.clientId = process.env.NEXT_PUBLIC_AMADEUS_CLIENT_ID || '';
        this.clientSecret = process.env.NEXT_PUBLIC_AMADEUS_CLIENT_SECRET || '';
        this.baseURL = process.env.NEXT_PUBLIC_AMADEUS_API_URL || 'https://test.api.amadeus.com';

        this.client = axios.create({
            baseURL: this.baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Add request interceptor to attach access token
        this.client.interceptors.request.use(
            async (config) => {
                await this.ensureValidToken();
                if (this.accessToken) {
                    config.headers.Authorization = `Bearer ${this.accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );
    }

    /**
     * Ensure we have a valid access token
     */
    private async ensureValidToken(): Promise<void> {
        const now = Date.now();

        // Check if token exists and is still valid (with 5 minute buffer)
        if (this.accessToken && this.tokenExpiry && this.tokenExpiry > now + 5 * 60 * 1000) {
            return;
        }

        // Get new token
        await this.authenticate();
    }

    /**
     * Authenticate with Amadeus API and get access token
     */
    private async authenticate(): Promise<void> {
        try {
            const params = new URLSearchParams();
            params.append('grant_type', 'client_credentials');
            params.append('client_id', this.clientId);
            params.append('client_secret', this.clientSecret);

            const response = await axios.post<AmadeusAuthResponse>(
                `${this.baseURL}/v1/security/oauth2/token`,
                params,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            this.accessToken = response.data.access_token;
            this.tokenExpiry = Date.now() + response.data.expires_in * 1000;
        } catch (error) {
            console.error('Authentication failed:', error);
            throw new Error('Failed to authenticate with Amadeus API');
        }
    }

    /**
     * Search for flight offers
     */
    async searchFlights(params: FlightSearchParams): Promise<AmadeusFlightOffersResponse> {
        try {
            const response = await this.client.get<AmadeusFlightOffersResponse>(
                '/v2/shopping/flight-offers',
                {
                    params: {
                        originLocationCode: params.originLocationCode,
                        destinationLocationCode: params.destinationLocationCode,
                        departureDate: params.departureDate,
                        returnDate: params.returnDate,
                        adults: params.adults,
                        children: params.children,
                        infants: params.infants,
                        travelClass: params.travelClass,
                        nonStop: params.nonStop,
                        currencyCode: params.currencyCode || 'USD',
                        max: params.max || 50,
                    },
                }
            );

            return response.data;
        } catch (error) {
            console.error('Flight search failed:', error);
            throw error;
        }
    }

    /**
     * Search for airports by keyword
     */
    async searchAirports(keyword: string): Promise<AmadeusAirportResponse> {
        try {
            const response = await this.client.get<AmadeusAirportResponse>(
                '/v1/reference-data/locations',
                {
                    params: {
                        subType: 'AIRPORT,CITY',
                        keyword,
                        'page[limit]': 10,
                    },
                }
            );

            return response.data;
        } catch (error) {
            console.error('Airport search failed:', error);
            throw error;
        }
    }
}

// Export singleton instance
export const amadeusAPI = new AmadeusAPI();
