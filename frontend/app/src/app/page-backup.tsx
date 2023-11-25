import { LandingNavbar } from "@/components/navbar/LandingNavbar";
import { ConfigMenu } from "@/components/config-button/ConfigMenu";
import { HomeSection } from "@/app/sections/HomeSection";
import { InstSection } from "@/app/sections/InstSection";
import { TeamSection } from "@/app/sections/TeamSection";
import { BlogSection } from "@/app/sections/BlogSection";
import { MapSection } from "@/app/sections/MapSection";
import { FooterSection } from "@/app/sections/FooterSection";

const HomePage = () => {
  return (
    <main>
      <LandingNavbar />
      <ConfigMenu type="both" />

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
