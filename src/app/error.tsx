"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-hero-gradient">
      <div className="text-center px-4">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-destructive/20 rounded-full mb-6">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
            Something went wrong
          </h1>
          <p className="font-sans text-lg text-muted-foreground max-w-md mx-auto mb-8">
            We encountered an unexpected error. Don't worry, our team has been notified and we're working on it.
          </p>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="mb-8 p-4 bg-muted rounded-lg text-left max-w-md mx-auto">
              <summary className="cursor-pointer font-medium">Error details</summary>
              <pre className="mt-2 text-xs overflow-auto">{error.message}</pre>
            </details>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset} className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
          
          <Button variant="outline" onClick={() => window.location.href = '/'} className="flex items-center gap-2">
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
