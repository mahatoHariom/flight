import { Suspense } from "react";
import ResultsClient from "./ResultsClient";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";

export default function ResultsPage() {
    return (
        <Suspense fallback={<div className="container mx-auto px-4 py-8"><LoadingSkeleton count={3} /></div>}>
            <ResultsClient />
        </Suspense>
    );
}
