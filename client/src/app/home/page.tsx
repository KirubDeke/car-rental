import CarRentalFAQ from "../../../components/FAQ";
import Footer from "../../../components/Footer";
import HeroSection from "../../../components/Hero";
import Testimonies from "../../../components/Testimonies";
import WhyChooseUs from "../../../components/WhyChooseUs";
import FleetPage from "../fleets/page";


export default function HomePage() {
    return (
        <>
            <HeroSection />
            <WhyChooseUs />
            <FleetPage/>
            <Testimonies/>
            <CarRentalFAQ/>
            <Footer />
        </>

    )
}