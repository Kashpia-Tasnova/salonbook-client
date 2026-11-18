import Hero from "@/components/home/Hero";
import Appointments from "@/components/home/Appointments";
import SalonServiceCategories from "@/components/home/SalonServiceCategories";

export default function Home() {
  return (
    <main>
      <Hero />
      <Appointments />
      <SalonServiceCategories />
    </main>
  );
}