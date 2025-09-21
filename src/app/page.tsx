import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { LiveInfo } from "@/components/LiveInfo";
import { ReservationForm } from "@/components/ReservationForm";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <About />
      <LiveInfo />
      <ReservationForm />
      <Footer />
    </main>
  );
}
