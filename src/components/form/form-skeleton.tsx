import { Skeleton } from '@/components/ui/skeleton';

export default function FormSkeleton({ row = 1 }: { row?: number }) {
  return (
    <div className="grid gap-[25px]">
      {Array.from({ length: row }).map((_, i) => (
        <div className="grid gap-2 space-y-0.5" key={i}>
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="h-9 w-full" />
        </div>
      ))}
      <Skeleton className="h-9 w-full" />
    </div>
  );
}
