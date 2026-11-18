
import Hero from "@/components/home/Hero";
import AboutUs from "@/components/home/AboutUs";
import Appointments from "@/components/home/Appointments";
import SalonServiceCategories from "@/components/home/SalonServiceCategories";
import FeaturedSalonServices from "@/components/home/FeaturedSalonServices";
import Contact from "@/components/home/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutUs />
      <Appointments />
      <SalonServiceCategories />
      <FeaturedSalonServices />
      <Contact />
    </>
  );
}
