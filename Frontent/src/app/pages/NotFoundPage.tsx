import { Link } from "react-router";
import { Home, AlertTriangle } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md bg-card border border-border rounded-[10px] p-8 sm:p-10 shadow-2xl">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 text-primary mb-5">
          <AlertTriangle size={24} />
        </div>
        <h1 className="text-5xl sm:text-6xl font-extrabold font-display text-foreground tracking-tight mb-2">
          404
        </h1>
        <p className="text-base text-muted-foreground mb-6 font-mono text-xs uppercase tracking-wider">
          Page Not Found
        </p>
        <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
          The requested page, publication, or project does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-all shadow-sm active:scale-[0.98]"
        >
          <Home size={16} />
          <span>Return to Home</span>
        </Link>
      </div>
    </div>
  );
}
