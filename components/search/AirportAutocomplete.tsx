"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useAirportSearch } from "@/hooks/useAirports";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { FormControl } from "@/components/ui/form";

interface AirportAutocompleteProps {
    value?: string;
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
    error?: string;
}

export function AirportAutocomplete({
    value,
    onChange,
    placeholder = "Search airport...",
}: AirportAutocompleteProps) {
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");

    const { data, isLoading } = useAirportSearch(inputValue);
    const airports = data?.data || [];

    // React to value changes from outside (e.g. swap)
    React.useEffect(() => {
        // If value changes but we don't have the airport in the current list, we might want to fetch it?
        // For now, we just display the code if we don't have details
    }, [value]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <FormControl>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                            "w-full justify-between",
                            !value && "text-muted-foreground"
                        )}
                    >
                        {value ? (
                            <span className="truncate">{value}</span>
                        ) : (
                            <span className="truncate">{placeholder}</span>
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder="Search city or airport..."
                        value={inputValue}
                        onValueChange={setInputValue}
                    />
                    <CommandList>
                        {isLoading && (
                            <div className="py-6 text-center text-sm text-muted-foreground">
                                Loading...
                            </div>
                        )}
                        {!isLoading && airports.length === 0 && inputValue.length > 1 && (
                            <CommandEmpty>No airports found.</CommandEmpty>
                        )}
                        <CommandGroup>
                            {airports.map((airport) => (
                                <CommandItem
                                    key={airport.id}
                                    value={airport.iataCode}
                                    onSelect={(currentValue) => {
                                        onChange(currentValue === value ? "" : currentValue);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === airport.iataCode ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <div className="flex flex-col">
                                        <span className="font-medium">{airport.iataCode} - {airport.name}</span>
                                        <span className="text-xs text-muted-foreground">{airport.address.cityName}, {airport.address.countryName}</span>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
