import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
    count?: number;
}

export const LoadingSkeleton = ({ count = 3 }: LoadingSkeletonProps) => {
    return (
        <div className="space-y-6">
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="flex flex-col space-y-3">
                    <Skeleton className="h-[200px] w-full rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                    </div>
                </div>
            ))}
        </div>
    );
};
