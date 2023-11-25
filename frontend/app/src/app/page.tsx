import { LandingNavbar } from "@/components/navbar/LandingNavbar";
import { ConfigMenu } from "@/components/config-button/ConfigMenu";
import { HomeSection } from "@/app/sections/HomeSection";
import { InstSection } from "@/app/sections/InstSection";
import { TeamSection } from "@/app/sections/TeamSection";
import { BlogSection } from "@/app/sections/BlogSection";
import { MapSection } from "@/app/sections/MapSection";
import { FooterSection } from "@/app/sections/FooterSection";
import { HomeSection2 } from "./sections/HomeSection2";
import { LandingNavbar2 } from "@/components/navbar/LandingNavbar2";
import { InstSection2 } from "./sections/InstSection2";

const HomePage = () => {
  return (
    <main>
      {/* La LandingNavbar vieja se ve para versiones mobiles */}
      <LandingNavbar2 />

      {/* <ConfigMenu type="both" /> */}

      {/* La HomeSection vieja se ve para versiones mobiles */}
      <div className="block lg:hidden">
        <HomeSection />
      </div>
      <div className="hidden lg:block">
        <HomeSection2 />
      </div>

      <InstSection2 />

      <TeamSection />
      {/* <BlogSection /> */}
      {/* <MapSection /> */}
      <FooterSection />
    </main>
  );
};

export default HomePage;
