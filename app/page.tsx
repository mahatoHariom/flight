"use client";

import { useRouter } from "next/navigation";
import { Plane, Search, TrendingUp, Shield, Sparkles } from "lucide-react";
import { SearchForm } from "@/components/search/SearchForm";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import type { FlightSearchParams } from "@/types";

export default function Home() {
  const router = useRouter();

  const handleSearch = (params: FlightSearchParams) => {
    const searchParams = new URLSearchParams();
    searchParams.set("origin", params.originLocationCode);
    searchParams.set("destination", params.destinationLocationCode);
    searchParams.set("departureDate", params.departureDate);
    if (params.returnDate) {
      searchParams.set("returnDate", params.returnDate);
    }
    searchParams.set("adults", params.adults.toString());
    if (params.children) searchParams.set("children", params.children.toString());
    if (params.infants) searchParams.set("infants", params.infants.toString());
    searchParams.set("travelClass", params.travelClass as string);

    router.push(`/results?${searchParams.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="glass-card sticky top-0 z-30 border-b backdrop-blur-lg">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg shadow-lg">
              <Plane className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight gradient-text">SkySearch</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1">
        <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 gradient-bg opacity-10 dark:opacity-20"></div>

          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

          <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-8 md:mb-12 space-y-4 md:space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Best Flight Deals</span>
                </div>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
                  Find Your Perfect
                  <span className="block gradient-text mt-2">Flight</span>
                </h2>
                <p className="text-muted-foreground text-lg md:text-xl lg:text-2xl max-w-2xl mx-auto">
                  Search hundreds of airlines and travel sites to find the best deals on flights worldwide.
                </p>
              </div>

              <div className="glass-card rounded-2xl shadow-2xl p-2 md:p-3">
                <SearchForm onSearch={handleSearch} />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-gradient-to-b from-muted/30 to-background dark:from-muted/10 dark:to-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose SkySearch</h2>
              <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
                Experience the best flight search with powerful features designed for travelers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
              <div className="glass-card p-8 md:p-10 rounded-2xl text-center space-y-5 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group border-2 border-transparent hover:border-blue-500/30">
                <div className="relative w-20 h-20 md:w-24 md:h-24 mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-500 shadow-lg shadow-blue-500/50"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <Search className="h-10 w-10 md:h-12 md:w-12 text-white drop-shadow-lg" strokeWidth={2.5} />
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-bold">Comprehensive Search</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Search across hundreds of airlines and travel sites in seconds to find your perfect flight
                </p>
              </div>

              <div className="glass-card p-8 md:p-10 rounded-2xl text-center space-y-5 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group border-2 border-transparent hover:border-emerald-500/30">
                <div className="relative w-20 h-20 md:w-24 md:h-24 mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-500 shadow-lg shadow-emerald-500/50"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <TrendingUp className="h-10 w-10 md:h-12 md:w-12 text-white drop-shadow-lg" strokeWidth={2.5} />
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-bold">Best Prices</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Real-time price tracking and instant alerts to help you get the best deals available
                </p>
              </div>

              <div className="glass-card p-8 md:p-10 rounded-2xl text-center space-y-5 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group border-2 border-transparent hover:border-purple-500/30">
                <div className="relative w-20 h-20 md:w-24 md:h-24 mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-500 shadow-lg shadow-purple-500/50"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <Shield className="h-10 w-10 md:h-12 md:w-12 text-white drop-shadow-lg" strokeWidth={2.5} />
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-bold">Secure Booking</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Safe and secure booking process with trusted partners and encrypted transactions
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 md:py-12 glass-card backdrop-blur-lg">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <Plane className="h-5 w-5" />
              </div>
              <span className="font-bold gradient-text">SkySearch</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} SkySearch. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
