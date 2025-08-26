import { cn } from "@/lib/utils";
import { Coffee } from "lucide-react";

interface CoffeeLoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export function CoffeeLoading({
  size = "md",
  text = "Đang tải...",
  className,
}: CoffeeLoadingProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const containerClasses = {
    sm: "gap-2",
    md: "gap-3",
    lg: "gap-4",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-8",
        containerClasses[size],
        className
      )}
    >
      <div className="relative">
        <div
          className={cn(
            "animate-bounce rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center",
            sizeClasses[size]
          )}
        >
          <Coffee className="w-1/2 h-1/2 text-white" />
        </div>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 opacity-25 animate-ping"></div>
      </div>

      <p
        className={cn(
          "text-gray-600 dark:text-gray-400 animate-pulse font-medium",
          size === "sm" && "text-xs",
          size === "md" && "text-sm",
          size === "lg" && "text-base"
        )}
      >
        {text}
      </p>
    </div>
  );
}

export function CoffeePageLoading({ text = "Đang tải trang..." }) {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <CoffeeLoading size="lg" text={text} />
    </div>
  );
}

export function CoffeeSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-amber-200 border-t-amber-500",
        sizeClasses[size]
      )}
    />
  );
}
