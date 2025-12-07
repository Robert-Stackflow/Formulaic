export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-fd-muted border-t-fd-primary`}
      />
    </div>
  );
}

export function LoadingPage({ message = "加载中..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-fd-background">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-fd-muted-foreground">{message}</p>
    </div>
  );
}

export function LoadingCard({ message = "加载中..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-fd-card border border-fd-border rounded-lg">
      <LoadingSpinner size="md" />
      <p className="mt-3 text-sm text-fd-muted-foreground">{message}</p>
    </div>
  );
}

export function LoadingContent({
  message = "加载中...",
}: {
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-fd-muted-foreground">{message}</p>
    </div>
  );
}
