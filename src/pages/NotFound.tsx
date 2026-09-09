import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import BrandLogo from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center max-w-md animate-fade-up">
        <div className="flex justify-center mb-6">
          <BrandLogo size="md" />
        </div>
        <p className="text-sm font-semibold uppercase tracking-wider text-secondary">404</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Page not found</h1>
        <p className="mt-3 text-muted-foreground">
          That page doesn&apos;t exist. Head back to the marketplace to keep browsing.
        </p>
        <Button asChild className="mt-6">
          <Link to="/">Back to Edumart</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
