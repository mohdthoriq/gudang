"use client";

import Link from "next/link";
import { useScrollHeader } from "../hooks/use-scroll-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const isScrolled = useScrollHeader();

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-desktop h-16 transition-all duration-300",
        isScrolled 
          ? "bg-header/80 backdrop-blur-md py-2 shadow-sm" 
          : "bg-transparent py-4"
      )}
    >
      <div className="flex items-center gap-sm">
        {/* Menggunakan warna --primary dari theme.css */}
        <span className="text-xl font-bold text-primary tracking-tight">
          Inventory Control
        </span>
      </div>

      <div className="flex items-center gap-xl">
        <nav className="hidden md:flex items-center gap-lg">
          <Link 
            href="#features" 
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Features
          </Link>
          <Link 
            href="#solutions" 
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Solutions
          </Link>
          <Link 
            href="#enterprise" 
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Enterprise
          </Link>
        </nav>

        {/* Border menggunakan --border dari theme.css */}
        <div className="h-6 w-px bg-border hidden md:block"></div>

        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full text-muted-foreground hover:text-primary hover:bg-accent"
        >
          <span className="material-symbols-outlined">account_circle</span>
        </Button>
      </div>
    </header>
  );
};