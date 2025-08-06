import Footer from "../../../components/Footer";
import HeroSection from "../../../components/Hero";
import WhyChooseUs from "../../../components/WhyChooseUs";
import FleetPage from "../fleets/page";


export default function HomePage() {
    return (
        <>
            <HeroSection />
            <WhyChooseUs />
            <FleetPage/>
            <Footer />
        </>

    )
}