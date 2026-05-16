import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function Loading() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="flex items-center gap-3 text-foreground-secondary text-sm">
        <LoadingSpinner /> Cargando datos...
      </div>
    </div>
  );
}
