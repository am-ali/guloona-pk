import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-hero-gradient">
      <div className="text-center px-4">
        <div className="mb-8">
          <h1 className="font-serif text-8xl md:text-9xl text-primary/30 mb-4">404</h1>
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
            Page Not Found
          </h2>
          <p className="font-sans text-lg text-muted-foreground max-w-md mx-auto mb-8">
            Oops! The page you're looking for seems to have wandered off like a delicate flower in the wind.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="flex items-center gap-2">
            <Link href="/">
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </Button>
          
          <Button variant="outline" onClick={() => window.history.back()} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
