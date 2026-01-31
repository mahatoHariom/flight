"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarIcon, Users, ArrowLeftRight, Search } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { FlightSearchParams } from "@/types";
import { AirportAutocomplete } from "./AirportAutocomplete";
import { CABIN_CLASSES } from "@/lib/utils/constants";
import { formatDateForAPI } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

const searchSchema = z.object({
    origin: z.string().min(3, "Select origin"),
    destination: z.string().min(3, "Select destination"),
    departureDate: z.date({
        error: "Date required",
    }),
    returnDate: z.date().optional(),
    adults: z.number().min(1).max(9),
    children: z.number().min(0).max(9),
    infants: z.number().min(0).max(9),
    travelClass: z.enum(["ECONOMY", "PREMIUM_ECONOMY", "BUSINESS", "FIRST"]),
}).refine((data) => data.origin !== data.destination, {
    message: "Origin and destination cannot be the same",
    path: ["destination"],
});

type SearchFormData = z.infer<typeof searchSchema>;

interface SearchFormProps {
    onSearch: (params: FlightSearchParams) => void;
    isLoading?: boolean;
}

export function SearchForm({ onSearch, isLoading = false }: SearchFormProps) {
    const [showPassengers, setShowPassengers] = useState(false);

    const form = useForm<SearchFormData>({
        resolver: zodResolver(searchSchema),
        defaultValues: {
            origin: "",
            destination: "",
            adults: 1,
            children: 0,
            infants: 0,
            travelClass: "ECONOMY",
        },
    });

    function onSubmit(data: SearchFormData) {
        const params: FlightSearchParams = {
            originLocationCode: data.origin,
            destinationLocationCode: data.destination,
            departureDate: formatDateForAPI(data.departureDate),
            returnDate: data.returnDate ? formatDateForAPI(data.returnDate) : undefined,
            adults: data.adults,
            children: data.children > 0 ? data.children : undefined,
            infants: data.infants > 0 ? data.infants : undefined,
            travelClass: data.travelClass,
            currencyCode: "USD",
            max: 50,
        };

        onSearch(params);
    }

    const swapAirports = () => {
        const origin = form.getValues("origin");
        const destination = form.getValues("destination");
        form.setValue("origin", destination);
        form.setValue("destination", origin);
    };

    const totalPassengers =
        (form.watch("adults") || 0) +
        (form.watch("children") || 0) +
        (form.watch("infants") || 0);

    return (
        <Card className="border-border shadow-lg">
            <CardContent className="p-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_auto_1fr_auto_auto] gap-4 items-end">
                            <FormField
                                control={form.control}
                                name="origin"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>From</FormLabel>
                                        <AirportAutocomplete
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Origin"
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="mb-2 hidden lg:flex"
                                onClick={swapAirports}
                            >
                                <ArrowLeftRight className="h-4 w-4" />
                            </Button>

                            <FormField
                                control={form.control}
                                name="destination"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>To</FormLabel>
                                        <AirportAutocomplete
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Destination"
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="departureDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Departure</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal lg:w-[150px]",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "MMM d, yyyy")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date < new Date() || date < new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="returnDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Return</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal lg:w-[150px]",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "MMM d, yyyy")
                                                        ) : (
                                                            <span>Optional</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date < (form.watch("departureDate") || new Date())
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-end">
                            <div className="relative">
                                <FormLabel className="block mb-2">Travelers & Class</FormLabel>
                                <Popover open={showPassengers} onOpenChange={setShowPassengers}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" role="combobox" className="w-full justify-between">
                                            <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4 opacity-50" />
                                                <span>{totalPassengers} Traveler{totalPassengers !== 1 && 's'}</span>
                                            </div>
                                            <span className="text-muted-foreground text-xs ml-2">
                                                {CABIN_CLASSES.find(c => c.value === form.watch("travelClass"))?.label}
                                            </span>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80 p-4" align="start">
                                        <div className="grid gap-4">
                                            <div className="space-y-2">
                                                <h4 className="font-medium leading-none">Travelers</h4>
                                                <p className="text-sm text-muted-foreground">Select travelers for this trip.</p>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="grid gap-1">
                                                    <span className="text-sm font-medium">Adults</span>
                                                    <span className="text-xs text-muted-foreground">12+ years</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline" size="icon" className="h-8 w-8"
                                                        onClick={() => form.setValue("adults", Math.max(1, (form.watch("adults") || 0) - 1))}
                                                        disabled={(form.watch("adults") || 0) <= 1}
                                                    >-</Button>
                                                    <span className="w-4 text-center">{form.watch("adults")}</span>
                                                    <Button
                                                        variant="outline" size="icon" className="h-8 w-8"
                                                        onClick={() => form.setValue("adults", Math.min(9, (form.watch("adults") || 0) + 1))}
                                                        disabled={(form.watch("adults") || 0) >= 9}
                                                    >+</Button>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="grid gap-1">
                                                    <span className="text-sm font-medium">Children</span>
                                                    <span className="text-xs text-muted-foreground">2-11 years</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline" size="icon" className="h-8 w-8"
                                                        onClick={() => form.setValue("children", Math.max(0, (form.watch("children") || 0) - 1))}
                                                        disabled={(form.watch("children") || 0) <= 0}
                                                    >-</Button>
                                                    <span className="w-4 text-center">{form.watch("children")}</span>
                                                    <Button
                                                        variant="outline" size="icon" className="h-8 w-8"
                                                        onClick={() => form.setValue("children", Math.min(9, (form.watch("children") || 0) + 1))}
                                                        disabled={(form.watch("children") || 0) >= 9}
                                                    >+</Button>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="grid gap-1">
                                                    <span className="text-sm font-medium">Infants</span>
                                                    <span className="text-xs text-muted-foreground">Under 2 years</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline" size="icon" className="h-8 w-8"
                                                        onClick={() => form.setValue("infants", Math.max(0, (form.watch("infants") || 0) - 1))}
                                                        disabled={(form.watch("infants") || 0) <= 0}
                                                    >-</Button>
                                                    <span className="w-4 text-center">{form.watch("infants")}</span>
                                                    <Button
                                                        variant="outline" size="icon" className="h-8 w-8"
                                                        onClick={() => form.setValue("infants", Math.min(9, (form.watch("infants") || 0) + 1))}
                                                        disabled={(form.watch("infants") || 0) >= 9}
                                                    >+</Button>
                                                </div>
                                            </div>

                                            <div className="space-y-2 pt-2 border-t">
                                                <h4 className="font-medium leading-none">Class</h4>
                                                <FormField
                                                    control={form.control}
                                                    name="travelClass"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select class" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {CABIN_CLASSES.map((cabin) => (
                                                                        <SelectItem key={cabin.value} value={cabin.value}>
                                                                            {cabin.label}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    "Searching..."
                                ) : (
                                    <>
                                        <Search className="mr-2 h-4 w-4" /> Search Flights
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
