export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-hero-gradient">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="font-serif text-lg text-foreground">Loading beautiful designs...</p>
      </div>
    </div>
  );
}
