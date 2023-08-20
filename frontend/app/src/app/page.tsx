import { LandingNavbar } from "@/components/navbar/LandingNavbar";
import { ConfigMenu } from "@/components/config-button/ConfigMenu";
import { HomeSection } from "./sections/HomeSection";
import { InstSection } from "./sections/InstSection";
import { TeamSection } from "./sections/TeamSection";
import { BlogSection } from "./sections/BlogSection";
import { MapSection } from "./sections/MapSection";
import { FooterSection } from "./sections/FooterSection";

const HomePage = () => {
  return (
    <main>
      <LandingNavbar />
      <ConfigMenu />

      <HomeSection />
      <InstSection />
      <TeamSection />
      <BlogSection />
      <MapSection />
      <FooterSection />
    </main>
  );
};

export default HomePage;
