import CTASection from "../../components/CTASection";
import FAQ from "../../components/FAQ";
import FeaturedJobs from "../../components/FeaturedJobs";
import Reveal from "../../components/Reveal";

import Testimonials from "../../components/Testimonials";
import TrustedCompanies from "../../components/TrustedCompanies";
import WhyDevHire from "../../components/WhyDevHire";
import Hero from "../sections/Hero";
import TopCompanies from "../sections/TopCompanies";

const Home = () => {
  return (
    <div>
      <Hero />
      <Reveal direction="up" delay={100}>
        
        <TrustedCompanies />
      </Reveal>
      <Reveal direction="up" delay={100}>
         <FeaturedJobs />
        
      </Reveal>
      <Reveal direction="up" delay={100}>
        <WhyDevHire />
      </Reveal>
      <Reveal direction="up" delay={100}>
       <TopCompanies />
      </Reveal>
      <Reveal direction="up" delay={100}>
        <Testimonials />
      </Reveal>
      <Reveal direction="up" delay={100}>
        <FAQ />
      </Reveal>
      <Reveal direction="up" delay={100}>
        <CTASection />
      </Reveal>
    </div>
  );
};

export default Home;
