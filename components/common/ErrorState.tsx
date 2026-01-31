import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ErrorStateProps {
    onRetry: () => void;
}

export const ErrorState = ({ onRetry }: ErrorStateProps) => {
    return (
        <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <Alert variant="destructive" className="max-w-md">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    Something went wrong while fetching flights. Please try again.
                </AlertDescription>
            </Alert>
            <Button onClick={onRetry} variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
            </Button>
        </div>
    );
};
