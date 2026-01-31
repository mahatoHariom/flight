"use client";

import { useState } from "react";
import { Plane, Clock, ChevronDown, ChevronUp } from "lucide-react";
import type { FlightOffer } from "@/types";
import {
    formatCurrency,
    formatDuration,
    formatTime,
    getStopsText,
    calculateTotalStops,
    getAirlineName,
} from "@/lib/utils/formatters";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface FlightCardProps {
    flight: FlightOffer;
    dictionary?: {
        carriers?: Record<string, string>;
    };
}

export function FlightCard({ flight, dictionary }: FlightCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const outbound = flight.itineraries[0];
    const firstSegment = outbound.segments[0];
    const lastSegment = outbound.segments[outbound.segments.length - 1];

    const totalStops = calculateTotalStops(outbound.segments);
    const mainCarrier = firstSegment.carrierCode;
    const airlineName = getAirlineName(mainCarrier, dictionary?.carriers);

    return (
        <Card className="mb-4 overflow-hidden border-l-4 border-l-primary transition-all hover:shadow-md">
            <CardContent className="p-0">
                <div className="flex flex-col md:flex-row p-4 md:p-6 gap-4 items-stretch md:items-center">
                    <div className="flex items-center gap-4 w-full md:w-1/4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Plane className="h-5 w-5" />
                        </div>
                        <div>
                            <div className="font-semibold text-lg">{airlineName}</div>
                            <div className="text-sm text-muted-foreground">{mainCarrier}</div>
                        </div>
                    </div>

                    <div className="flex-1 flex items-center justify-between gap-4">
                        <div className="text-center min-w-[60px]">
                            <div className="text-xl font-bold">{formatTime(firstSegment.departure.at)}</div>
                            <div className="text-sm font-medium text-muted-foreground">{firstSegment.departure.iataCode}</div>
                        </div>

                        <div className="flex-1 flex flex-col items-center px-2">
                            <div className="text-xs text-muted-foreground mb-1">{formatDuration(outbound.duration)}</div>
                            <div className="w-full flex items-center gap-2">
                                <Separator className="flex-1" />
                                <Plane className="h-3 w-3 text-muted-foreground rotate-90" />
                                <Separator className="flex-1" />
                            </div>
                            <div className="text-xs font-medium text-primary mt-1">
                                {getStopsText(totalStops)}
                            </div>
                        </div>

                        <div className="text-center min-w-[60px]">
                            <div className="text-xl font-bold">{formatTime(lastSegment.arrival.at)}</div>
                            <div className="text-sm font-medium text-muted-foreground">{lastSegment.arrival.iataCode}</div>
                        </div>
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4 md:w-1/4 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 mt-2 md:mt-0">
                        <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                                {formatCurrency(flight.price.total, flight.price.currency)}
                            </div>
                            <div className="text-xs text-muted-foreground">per person</div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="gap-1"
                        >
                            {isExpanded ? "Hide Details" : "View Details"}
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>

                {isExpanded && (
                    <div className="bg-muted/30 border-t p-4 md:p-6 animate-in slide-in-from-top-2 duration-200">
                        <h4 className="font-semibold mb-4 flex items-center gap-2">
                            <Clock className="h-4 w-4" /> Flight Details
                        </h4>

                        <div className="space-y-6 relative">
                            <div className="absolute left-[19px] top-6 bottom-6 w-0.5 bg-border z-0 hidden md:block" />

                            {outbound.segments.map((segment, index) => (
                                <div key={segment.id} className="relative z-10">
                                    {index > 0 && (
                                        <div className="ml-10 mb-4 p-2 bg-secondary/50 rounded text-xs text-secondary-foreground inline-flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            Layover in {segment.departure.iataCode}
                                        </div>
                                    )}

                                    <div className="grid grid-cols-[auto_1fr] gap-4">
                                        <div className="flex flex-col justify-between py-1">
                                            <div className="text-sm font-bold">{formatTime(segment.departure.at)}</div>
                                            <div className="h-8 md:h-12"></div>
                                            <div className="text-sm font-bold text-muted-foreground">{formatTime(segment.arrival.at)}</div>
                                        </div>

                                        <div className="border-l-2 border-primary/20 pl-4 md:border-l-0 md:pl-0">
                                            <div className="hidden md:block absolute left-[15px] w-2.5 h-2.5 rounded-full bg-primary border-2 border-background mt-1.5" />

                                            <div className="bg-card rounded-lg border p-3 md:p-4 shadow-sm">
                                                <div className="flex flex-col md:flex-row justify-between md:items-start gap-2 mb-2">
                                                    <div>
                                                        <div className="font-medium text-lg">
                                                            {segment.departure.iataCode} <span className="text-muted-foreground text-sm font-normal">Terminal {segment.departure.terminal}</span>
                                                            <span className="mx-2">→</span>
                                                            {segment.arrival.iataCode} <span className="text-muted-foreground text-sm font-normal">Terminal {segment.arrival.terminal}</span>
                                                        </div>
                                                        <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                                            <span className="font-medium text-foreground">
                                                                {getAirlineName(segment.carrierCode, dictionary?.carriers)}
                                                            </span>
                                                            <span>•</span>
                                                            <span>Flight {segment.number}</span>
                                                            <span>•</span>
                                                            <span>{formatDuration(segment.duration)}</span>
                                                        </div>
                                                    </div>
                                                    <Badge variant="outline">{segment.aircraft.code}</Badge>
                                                </div>
                                            </div>

                                            <div className="hidden md:block absolute left-[15px] w-2.5 h-2.5 rounded-full bg-border border-2 border-background mt-auto mb-1.5 bottom-0" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="text-sm text-muted-foreground space-y-1 w-full md:w-auto">
                                <div className="flex justify-between md:justify-start gap-4">
                                    <span>Base Fare:</span>
                                    <span className="font-medium text-foreground">{formatCurrency(flight.price.base, flight.price.currency)}</span>
                                </div>
                                {flight.price.fees.map((fee, i) => (
                                    <div key={i} className="flex justify-between md:justify-start gap-4">
                                        <span>{fee.type}:</span>
                                        <span className="font-medium text-foreground">{formatCurrency(fee.amount, flight.price.currency)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="text-right w-full md:w-auto">
                                <div className="text-sm text-muted-foreground">Total Price</div>
                                <div className="text-2xl font-bold text-primary mb-2">
                                    {formatCurrency(flight.price.total, flight.price.currency)}
                                </div>
                                <Button size="lg" className="w-full md:w-auto">Select Flight</Button>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
