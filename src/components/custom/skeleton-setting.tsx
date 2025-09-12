import { Skeleton } from '@/components/ui/skeleton';

export default function SettingSkeleton({ row = 1 }: { row?: number }) {
  return (
    <div className="space-y-4 rounded-xl border p-5 shadow-none">
      <div className="space-y-3">
        <div className="flex flex-col space-y-2 pb-4">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-32" />
        </div>

        {Array.from({ length: row }).map((_, i) => (
          <div className="grid gap-2 space-y-0.5" key={i}>
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-9 w-full" />
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
}
