import { LandingCard } from "./landing-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const FeatureGrid = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 pb-32">
      <div className="grid grid-cols-12 gap-6">
        
        {/* Dashboard Card */}
        <LandingCard
          isMain
          title="Akurasi Stok Real-Time"
          description="Pantau pergerakan barang masuk dan keluar dengan pencatatan otomatis yang terintegrasi."
          icon="dashboard"
          iconColorClass="text-secondary" // Menggunakan warna hijau dari theme.css
        />

        {/* Tracing Card */}
        <LandingCard
          title="Scan & Lacak SKU"
          description="Lacak histori setiap helai pakaian melalui sistem barcode untuk meminimalisir kehilangan."
          icon="qr_code_scanner"
          iconColorClass="text-destructive" // Menggunakan warna merah dari theme.css
        >
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
            <div className="flex flex-col">
              <span className="text-xs font-mono text-primary font-bold">SKU-2026-PRO</span>
              <span className="text-[10px] text-muted-foreground">Last scanned 2m ago</span>
            </div>
            <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined">inventory_2</span>
            </div>
          </div>
        </LandingCard>

        {/* QC Card - Menggunakan Primary Theme */}
        <Card className="col-span-12 md:col-span-4 bg-primary text-primary-foreground border-none shadow-lg flex flex-col justify-center items-center text-center p-8 transition-transform hover:scale-[1.02]">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-4xl">verified</span>
          </div>
          <CardTitle className="text-white">Kualitas Terjamin</CardTitle>
          <p className="text-sm opacity-80 mt-2">Sistem QC terintegrasi untuk setiap barang.</p>
        </Card>

        {/* Analytics Card */}
        <LandingCard
          title="Analitik Logistik"
          description="Laporan mingguan otomatis perputaran stok paling lambat dan paling cepat."
          icon="history"
          iconColorClass="text-primary"
        >
          <div className="flex flex-col md:flex-row gap-4 mt-2">
            <div className="flex-1 p-4 bg-muted/50 rounded-xl border border-border">
              <span className="text-[10px] uppercase text-muted-foreground font-bold">Turnover</span>
              <div className="text-2xl font-bold text-primary">+24%</div>
            </div>
            <div className="flex-1 p-4 bg-muted/50 rounded-xl border border-border">
              <span className="text-[10px] uppercase text-muted-foreground font-bold">Efficiency</span>
              <div className="text-2xl font-bold text-secondary">98.2%</div>
            </div>
          </div>
        </LandingCard>

      </div>
    </section>
  );
};
