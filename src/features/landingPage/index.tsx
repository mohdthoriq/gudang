import { Navbar } from './components/landing-navbar';
import { Hero } from './components/landing-hero';
import { FeatureGrid } from './components/landing-grid';
import { Footer } from './components/landing-footer';


export default function LandingPageFeature() {
  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-grow pt-16 hero-gradient">
        {/* Hero Section: Judul Utama & CTA */}
        <Hero />
        
        {/* Grid Section: Menampilkan fitur-fitur utama menggunakan Card UI */}
        <FeatureGrid />
      </main>
      
      {/* Footer Section */}
      <Footer />
    </div>  
  );
}
