import Link from "next/link";
import { cn } from "@/lib/utils";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Branding Section */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <span className="text-lg font-bold text-primary tracking-tight">
            Inventory Control
          </span>
          <p className="text-sm text-muted-foreground mt-2">
            © {currentYear} Sistem Inventaris Gudang Baju. <br className="md:hidden" />
            Hak Cipta Dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
};