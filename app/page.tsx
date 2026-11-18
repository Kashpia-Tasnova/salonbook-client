
import Hero from "@/components/home/Hero";
import Appointments from "@/components/home/Appointments";
import SalonServiceCategories from "@/components/home/SalonServiceCategories";
import FeaturedSalonServices from "@/components/home/FeaturedSalonServices";

export default function Home() {
  return (
    <main>
      <Hero />
      <Appointments />
      <SalonServiceCategories />
      <FeaturedSalonServices />
    </main>
  );
}
