import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const Hero = () => {
  return (
    <section className="max-w-7xl mx-auto px-margin-desktop py-32 flex flex-col items-center text-center">
      <h1 className="font-headline-lg text-[64px] leading-[72px] mb-lg text-primary max-w-4xl tracking-tight">
        Sistem Inventaris Gudang Baju Masa Depan
      </h1>
      <p className="font-body-lg text-on-surface-variant max-w-3xl mb-xl leading-relaxed">
        Solusi manajemen stok pakaian yang presisi dan efisien...
      </p>
      <div className="flex gap-md items-center">
        <Button asChild size="lg" className="bg-primary hover:shadow-xl transition-all h-auto py-4 px-8 text-lg">
          <Link href="/dashboard" className="flex items-center gap-sm group">
            Masuk ke Gudang
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </Button>
        <Button variant="outline" size="lg" className="h-auto py-4 px-8 text-lg">
          Pelajari Fitur
        </Button>
      </div>
    </section>
  );
};